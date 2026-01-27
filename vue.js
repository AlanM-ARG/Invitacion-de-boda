import { db, collection, addDoc, doc, updateDoc, getDocs } from "./firebaseConfig.js";
const { createApp } = Vue;
createApp({

    data() {
        return {
            message: 'Hello Vue!',
            titulo: 'Reproductor de Música con Vue.js',
            currentTime: 0,
            duration: 0,
            // loading: true, // Inicialmente se muestra el loader
            audio: null,   // Objeto de audio
            isPlaying: false,
        }
    },
    created() {

    },
    methods: {
        async formularioAsistencia() {
            // Función para generar el HTML del formulario
            const { value: formValues } = await Swal.fire({
                html: this.generateFormHtml(),
                showCloseButton: true,
                showCancelButton: false,
                showConfirmButton: false,
                didOpen: () => {
                    // Inicializa una instancia de Vue en el modal de SweetAlert
                    const modalApp = Vue.createApp({
                        data() {
                            return {
                                db: null,
                                familias: [],
                                selectedFamily: '',
                                selectedMembers: [],
                                confirmedMembers: [],
                                attendanceStatus: 'decline',
                                additionalInfo: '',
                                confirmaciones: [],
                                miembrosConfirmados: [],
                                errors: {
                                    selectedFamily: false,
                                    confirmedMembers: false,
                                    attendanceStatus: false,
                                },
                                successMessage: '',
                                errorMessage: ''
                            };
                        },
                        async created() {

                            await this.initFirebase(); // Inicializa Firebase en el componente del modal
                            await this.getConfirmations();
                            await this.loadFamiliesData();
                        },
                        methods: {
                            async initFirebase() {
                                this.db = db;  // Asigna Firestore a `this.db`

                            },
                            async getConfirmations() {
                                const confirmations = collection(this.db, 'confirmaciones');
                                const listadodeConfirmaciones = await getDocs(confirmations);
                                this.confirmaciones = listadodeConfirmaciones.docs.map(doc => doc.data());
                                this.miembrosConfirmados = [];

                                this.confirmaciones.forEach(confirmacion => {
                                    if (confirmacion.confirmedMembers && confirmacion.selectedFamily) {
                                        confirmacion.confirmedMembers.forEach(miembro => {
                                            const uniqueKey = `${confirmacion.selectedFamily} ${miembro}`;
                                            this.miembrosConfirmados.push(uniqueKey);
                                        });
                                    }
                                });
                            }
                            ,
                            async loadFamiliesData() {
                                try {
                                    const invitados = collection(this.db, 'invitados');
                                    const listadoDeFamilias = await getDocs(invitados);
                                    this.familias = listadoDeFamilias.docs
                                        .map(doc => doc.data())[0].familias
                                        .sort((a, b) => a.apellido.localeCompare(b.apellido));

                                    // Filtrar y ordenar los miembros de cada familia
                                    this.familias = this.familias.filter(familia => {
                                        if (Array.isArray(familia.miembros)) {
                                            const miembrosFiltrados = familia.miembros.filter(miembro => {
                                                const uniqueKey = `${familia.apellido} ${miembro}`;
                                                console.log(`${miembro} (${uniqueKey}) IS CONFIRMED? ${this.miembrosConfirmados.includes(uniqueKey)}`);
                                                return !this.miembrosConfirmados.includes(uniqueKey);
                                            });

                                            miembrosFiltrados.sort((a, b) => a.localeCompare(b));
                                            familia.miembros = miembrosFiltrados;

                                            return miembrosFiltrados.length > 0;
                                        }
                                        return false;
                                    });

                                    console.log(this.familias);

                                } catch (error) {
                                    console.error("Error al cargar los datos del JSON:", error);
                                }
                            }
                            ,
                            updateMembers() {
                                const family = this.familias.find(f => f.apellido === this.selectedFamily);
                                this.selectedMembers = family ? family.miembros : [];
                                this.confirmedMembers = [];
                            },
                            resetForm() {
                                // Resetea todos los datos del formulario
                                this.selectedFamily = '';
                                this.selectedMembers = [];
                                this.confirmedMembers = [];
                                this.attendanceStatus = 'decline';
                                this.additionalInfo = '';
                                this.successMessage = '';
                                this.errorMessage = '';
                            },
                            async submitForm() {
                                // Validar y enviar formulario a Firebase
                                this.errors.selectedFamily = !this.selectedFamily;
                                this.errors.confirmedMembers = this.confirmedMembers.length === 0;
                                this.errors.attendanceStatus = !this.attendanceStatus;

                                if (!this.errors.selectedFamily && !this.errors.confirmedMembers && !this.errors.attendanceStatus) {
                                    // Si no hay errores, guarda en Firestore
                                    const confirmationData = {
                                        selectedFamily: this.selectedFamily,
                                        confirmedMembers: this.confirmedMembers,
                                        attendanceStatus: this.attendanceStatus,
                                        additionalInfo: this.additionalInfo
                                    };
                                    try {
                                        await addDoc(collection(this.db, 'confirmaciones'), confirmationData)
                                            .then(() => {
                                                if (this.attendanceStatus == "decline") {
                                                    Swal.fire({
                                                        position: "center",
                                                        icon: "success",
                                                        title: "¡Gracias por confirmar tu asistencia, una pena que no puedas asistir",
                                                        html: `
                                                    <span style='font-size:100px;'>&#129402;</span>`,
                                                        showConfirmButton: false,
                                                        timer: 3000
                                                    })
                                                } else {
                                                    Swal.fire({
                                                        position: "center",
                                                        icon: "success",
                                                        title: "¡Gracias por confirmar tu asistencia, nos vemos pronto!",
                                                        html: `
                                                    <span style='font-size:100px;'>&#128513;</span>`,
                                                        showConfirmButton: false,
                                                        timer: 3000
                                                    })
                                                }
                                                this.getConfirmations();
                                            });
                                        this.resetForm();
                                    } catch (error) {
                                        console.error("Error al guardar la confirmación:", error);
                                        this.errorMessage = 'Ocurrió un error al guardar la confirmación. Inténtalo de nuevo.';
                                    }
                                } else {
                                    // Si hay errores, muestra el mensaje
                                    this.errorMessage = 'Por favor, completa todos los campos requeridos.';
                                }
                            }
                        }
                    });
                    modalApp.mount('#dynamic-form');

                },
            });
            console.log(formValues)
        },
        generateFormHtml() {
            return `<div id="dynamic-form" style="text-align: start !important;">
            <div class="w-form">
                        <form id="wf-form-Formulario-de-asistencia" name="wf-form-Formulario-de-asistencia"
                            data-name="Formulario de asistencia" method="get" class="form">
                            <h4 class="heading-4" style="font-size: 7vw;">Confirmación de Asistencia a Nuestra Boda</h4>
            
                            <!-- Selección de familia -->
                            <label class="place" for="Family">Selección de familia:</label>
                            <select class="form-select" v-model="selectedFamily" @change="updateMembers">
                                <option disabled value="">Selecciona tu familia:</option>
                                <option v-for="(familia, index) in familias" :key="index" :value="familia.apellido">{{ familia.apellido }}</option>
                            </select>
            
                            <!-- Miembros de la familia -->
                            <label class="place" for="nameMembers">Miembros de la familia:</label>
                            <div v-if="selectedMembers.length > 0">
                                <div v-for="(miembro, index) in selectedMembers" :key="index" class="form-check">
                                    <input :id="index" class="form-check-input" type="checkbox" :value="miembro" v-model="confirmedMembers">
                                    <label  class="form-check-label" :for="index">{{ miembro }}</label>
                                </div>
                            </div>
                            <div v-else>
                                <p class="warning-message">
                                    Selecciona una familia para ver los miembros.
                                </p>
                            </div>
            
                            <!-- Confirmación de asistencia -->
                            <label class="place" for="nameMembers">Confirmar asistencia:</label>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="attendance" id="flexRadioDefault1" value="confirm"
                                    v-model="attendanceStatus">
                                <label class="form-check-label" for="flexRadioDefault1">Sí, confirmo por los seleccionados.</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="attendance" id="flexRadioDefault2" value="decline"
                                    v-model="attendanceStatus" checked>
                                <label class="form-check-label" for="flexRadioDefault2">No, no podrán asistir.</label>
                            </div>
            
                            <!-- Información adicional -->
                            <div class="mb-3">
                                <label for="exampleFormControlTextarea1" class="place">Información adicional:</label>
                                <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" v-model="additionalInfo"
                                    placeholder="Ingrese algún dato importante. Ej: Soy vegetariano"></textarea>
                            </div>
            
    <!-- Mensaje de éxito -->
    <p v-if="successMessage" class="success-message">
        {{ successMessage }}
    </p>

    <!-- Mensaje de error -->
<p v-if="errorMessage" class="error-message" v-html="errorMessage"></p>

                            <!-- Botón de envío -->
                            <div class="w-layout-hflex flex-block-2">
                                <button type="button" @click="submitForm" class="button1" style="--clr: #7808d0">
                                    <span class="button__icon-wrapper">
                                        <svg viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="button__icon-svg"
                                            width="10">
                                            <path
                                                d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
                                                fill="currentColor"></path>
                                        </svg>
                                        <svg viewBox="0 0 14 15" fill="none" width="10" xmlns="http://www.w3.org/2000/svg"
                                            class="button__icon-svg button__icon-svg--copy">
                                            <path
                                                d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
                                                fill="currentColor"></path>
                                        </svg>
                                    </span>
                                    Enviar Confirmación
                                </button>
                            </div>
                        </form>
                    </div>
            </div>`;
        },
        togglePlayPause() {
            if (this.isPlaying) {
                this.audio.pause();
            } else {
                this.audio.play();
            }
            this.isPlaying = !this.isPlaying;
        },
        informacionAdicional() {
            Swal.fire({
                showCloseButton: true,
                showCancelButton: false,
                showConfirmButton: false,
                html: `
        <h4 class="heading-4">Información Importante</h4>

<ul style="text-align:start !important; margin-top:15%;">
  <li style="margin-top:5%;">¡Les pedimos puntualidad para disfrutar de todos los momentos!</li>
  <li style="margin-top:5%;">Recordamos que será un evento al aire libre, por lo que sugerimos calzado cómodo y adecuado para jardín.</li>
  <li style="margin-top:5%;">¡No olviden traer traje de baño y toalla! Habrá un espacio disponible para quienes quieran refrescarse en la piscina.</li>
  <li style="margin-top:5%;">Confirma antes del 1 de diciembre de 2024.</li>
  <li style="margin-top:5%;">Si surge algún inconveniente y no pueden asistir, avísenos con al menos 48 horas de anticipación.</li>
  <li style="margin-top:5%;">Contaremos con espacio para estacionar en la quinta, pero también es posible llegar caminando desde los alrededores.</li>
  <li style="margin-top:5%;">Llevar Repelente.</li>
  <li style="margin-top:5%;">Para cualquier consulta o información adicional, puedes comunicarte con nosotros al <a href="tel:1162233436">1162233436</a></li>

</ul>
            `,
            })
        },
        regalos() {
            Swal.fire({
                showCloseButton: true,
                showCancelButton: false,
                showConfirmButton: false,
                html: this.regaloshtml(),
                didOpen: () => {
                    // Inicializa una instancia de Vue en el modal de SweetAlert
                    const modalApp = Vue.createApp({
                        data() {
                            return {
                                db: null,
                                regalos: []
                            };
                        },
                        async created() {
                            await this.initFirebase();
                            await this.cargarRegalos();
                        },
                        methods: {
                            initFirebase() {
                                this.db = db;  // Asigna Firestore a `this.db`

                            },
                            // Cargar la lista de regalos de Firestore y ordenar
                            async cargarRegalos() {
                                const querySnapshot = await getDocs(collection(db, "regalos"));
                                this.regalos = querySnapshot.docs
                                    .map(doc => ({ id: doc.id, ...doc.data() }))
                                this.regalos.sort((a, b) => {
                                    // Primero ordenar por estado (reservados al final)
                                    if (a.estado !== b.estado) {
                                        return a.estado - b.estado;
                                    }
                                    // Luego, ordenar alfabéticamente por nombre
                                    return a.nombre.localeCompare(b.nombre);
                                });
                            },

                            // Reservar un regalo en Firestore usando SweetAlert2
                            async reservarRegalo(id) {
                                // Pedir nombre o familia usando SweetAlert
                                const { value: invitado } = await Swal.fire({
                                    title: 'Reserva de Regalo',
                                    input: 'text',
                                    inputLabel: 'Ingrese su nombre o familia para confirmar la reserva',
                                    customClass: {
                                        inputLabel: 'swal2-centered-label'
                                    },
                                    inputPlaceholder: 'Nombre o Familia',
                                    showCancelButton: true,
                                    confirmButtonText: 'Reservar',
                                    cancelButtonText: 'Cancelar',
                                    inputValidator: (value) => {
                                        if (!value) {
                                            return 'Debe ingresar un nombre o familia para continuar';
                                        }
                                    }
                                });

                                // Si el usuario cancela o no ingresa nada, no se hace nada
                                if (!invitado) return;

                                try {
                                    // Acceder al documento específico en Firestore
                                    const regaloRef = doc(db, "regalos", id);

                                    // Actualizar el campo `estado` y `invitado` en Firestore
                                    await updateDoc(regaloRef, {
                                        estado: true,
                                        invitado: invitado
                                    });

                                    // Actualizar el estado local y ordenar la lista
                                    this.regalos = this.regalos
                                        .map(regalo => (regalo.id === id ? { ...regalo, estado: true, invitado } : regalo))
                                        .sort((a, b) => a.estado - b.estado);

                                    Swal.fire('Reservado!', 'El regalo ha sido reservado con éxito.', 'success');
                                } catch (error) {
                                    console.error("Error al reservar el regalo:", error);
                                    Swal.fire('Error', 'Hubo un problema al reservar el regalo. Intente nuevamente.', 'error');
                                }
                            },
                            async agregarRegaloPersonalizado() {
                                const { value: formValues } = await Swal.fire({
                                    title: '¿Quieres regalarnos algo especial?',
                                    html:
                                        '<label style="text-align:center">Nombre del regalo:</label>' +
                                        '<input id="regalo" class="swal2-input m-0 w-100" placeholder="Ej. Cena romántica, viaje, etc.">' +
                                        '<label style="text-align:center">Tu nombre o familia:</label>' +
                                        '<input id="invitado" class="swal2-input m-0 w-100" placeholder="Ej. Familia Pérez">',
                                    focusConfirm: false,
                                    showCancelButton: true,
                                    confirmButtonText: 'Agregar',
                                    cancelButtonText: 'Cancelar',
                                    preConfirm: () => {
                                        const regaloNombre = document.getElementById('regalo').value;
                                        const invitadoNombre = document.getElementById('invitado').value;
                                        if (!regaloNombre || !invitadoNombre) {
                                            Swal.showValidationMessage('Debes completar ambos campos');
                                            return;
                                        }
                                        return { regaloNombre, invitadoNombre };
                                    }
                                });

                                if (!formValues) return;

                                try {
                                    // Crear el nuevo regalo con el nombre del invitado
                                    const nuevoRegalo = {
                                        nombre: formValues.regaloNombre,
                                        descripcion: 'Regalo personalizado',
                                        estado: true, // Este regalo ya está reservado por el invitado
                                        invitado: formValues.invitadoNombre
                                    };
                                    const docRef = await addDoc(collection(db, "regalos"), nuevoRegalo);

                                    // Actualizar la lista local
                                    this.regalos.push({ id: docRef.id, ...nuevoRegalo });
                                    this.regalos.sort((a, b) => a.estado - b.estado);

                                    Swal.fire('Agregado!', 'Tu regalo ha sido agregado y reservado con éxito.', 'success');
                                } catch (error) {
                                    console.error("Error al agregar el regalo:", error);
                                    Swal.fire('Error', 'Hubo un problema al agregar el regalo. Intente nuevamente.', 'error');
                                }
                            }
                        }
                    });
                    modalApp.mount('#dynamic-alert');
                },
            })
        },
        regaloshtml() {

            return `<div id="dynamic-alert">
            <h4 class="heading-4">Regalos</h4>

<p class="place" style="text-align:start !important; margin-top:15%;">
Para ayudarnos a construir nuestro hogar juntos. Si desean hacerlo, aquí está nuestros datos:
</p>
<p>Alias:<br/> 
<b>alan.morua</b></p>
    <p>CVU: <b>0000003100078167484238</b></p>
    <p class="place" style="text-align:start !important; margin-top:15%;">
Si deseas hacernos un regalo especial abre la lista de regalos:
</p>
  <button id="bottone5" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
    Abrir lista de regalos
   </button>
</p>
<div class="collapse" id="collapseExample">
  <div class="d-flex flex-column gap-1" >
    <h2>Lista de Regalos</h2>
    <div class="card w-100" v-for="regalo in regalos" :key="regalo.id">
  <div class="card-body">
    <h5 class="card-title" :class="{ tachado: regalo.estado }">{{ regalo.nombre }}</h5>
    <p class="card-text" :class="{ tachado: regalo.estado }">{{ regalo.descripcion }}</p>
    <button id="bottone5" v-if="!regalo.estado" @click="reservarRegalo(regalo.id)" >Reservar</button>
        <button id="bottone5" v-else disabled>Reservado</button>
  </div>
</div>
<button id="bottone5" @click="agregarRegaloPersonalizado">¿Quieres regalarnos algo que no está en la lista? Hazlo saber</button>
</div>

      

</div>

    </div>
    
  </div>
  </div>`
        },
        // iniciarMusica() {
        //     this.audio = this.$refs.audio;
        //     this.audio.play()
        //         .then(() => {
        //             this.isPlaying = true;
        //             this.loading = false;
        //         })
        //         .catch((error) => {
        //             console.error("Error al reproducir la música:", error);
        //             this.loading = false;
        //         });
        // }
    },
    mounted() {
        this.audio = this.$refs.audio;

        if (this.audio) {
            this.audio.onloadedmetadata = () => {
                this.duration = this.audio.duration;
            };
            this.audio.ontimeupdate = () => {
                this.currentTime = this.audio.currentTime;
            };
            this.audio.onended = () => {
                this.isPlaying = false;
            };
        }

        document.addEventListener('DOMContentLoaded', function () {
            localStorage.setItem('theme', 'light');
        });
    }

}).mount('#app');
