const { createApp } = Vue;

createApp({
    data() {
        return {
            message: 'Hello Vue!',
            titulo: 'Reproductor de Música con Vue.js',
            currentTime: 0,
            duration: 0,
            isPlaying: false,
            audio: null,
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
                    // Initialize Vue in the modal
                    const modalApp = Vue.createApp({
                        data() {
                            return {
                                familias: [],
                                selectedFamily: '',
                                selectedMembers: [],
                                confirmedMembers: [],
                                attendanceStatus: '',
                                additionalInfo: '',
                                errors: {
                                    selectedFamily: false,
                                    confirmedMembers: false,
                                    attendanceStatus: false,
                                },
                                successMessage: '', // Mensaje de éxito
                                errorMessage: ''    // Mensaje de error
                            };
                        },
                        created() {
                            this.loadFamiliesData();
                            this.initFirebase(); // Inicializa Firebase al crear el componente
                        },
                        methods: {
                            initFirebase() {
                                // Importar y configurar Firebase
                                /* const firebaseConfig = {
                                    apiKey: "YOUR_API_KEY",
                                    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
                                    databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
                                    projectId: "YOUR_PROJECT_ID",
                                    storageBucket: "YOUR_PROJECT_ID.appspot.com",
                                    messagingSenderId: "YOUR_SENDER_ID",
                                    appId: "YOUR_APP_ID"
                                };
                                const app = firebase.initializeApp(firebaseConfig);
                                this.db = firebase.firestore(); */ // Usa Firestore
                                // O para Realtime Database, puedes usar:
                                // this.db = firebase.database();
                            },
                            async loadFamiliesData() {
                                try {
                                    const response = await fetch('./miembros.json');
                                    const data = await response.json();
                                    this.familias = data.familias;
                                } catch (error) {
                                    console.error("Error al cargar los datos del JSON:", error);
                                }
                            },
                            updateMembers() {
                                const family = this.familias.find(f => f.apellido === this.selectedFamily);
                                this.selectedMembers = family ? family.miembros : [];
                                this.confirmedMembers = []; // Resetea los miembros confirmados cuando se cambia la familia
                            },
                            resetForm() {
                                this.selectedFamily = '';
                                this.selectedMembers = [];
                                this.confirmedMembers = [];
                                this.attendanceStatus = '';
                                this.additionalInfo = '';
                                this.successMessage = ''; // Resetea el mensaje de éxito
                                this.errorMessage = '';   // Resetea el mensaje de error
                            },
                            async submitForm() {
                                this.errors.selectedFamily = !this.selectedFamily;
                                this.errors.confirmedMembers = this.confirmedMembers.length === 0;
                                this.errors.attendanceStatus = !this.attendanceStatus;

                                if (!this.errors.selectedFamily && !this.errors.confirmedMembers && !this.errors.attendanceStatus) {
                                    // Si no hay errores, guarda los datos en Firebase
                                    const confirmationData = {
                                        selectedFamily: this.selectedFamily,
                                        confirmedMembers: this.confirmedMembers,
                                        attendanceStatus: this.attendanceStatus,
                                        additionalInfo: this.additionalInfo
                                    };

                                    try {
                                        // Guardar en Firestore
                                        await this.db.collection('confirmaciones').add(confirmationData);

                                        // Mostrar mensaje de éxito
                                        this.successMessage = '¡Gracias por confirmar tu asistencia!';
                                        this.resetForm(); // Resetea el formulario después de enviar
                                    } catch (error) {
                                        console.error("Error al guardar la confirmación:", error);
                                        this.errorMessage = 'Ocurrió un error al guardar la confirmación. Inténtalo de nuevo.';
                                    }
                                } else {
                                    // Si hay errores, establecer el mensaje de error con saltos de línea
                                    let errorMessage = 'Por favor, completa los siguientes campos: <br>';
                                    if (this.errors.selectedFamily) {
                                        errorMessage += ' - Selección de familia.<br>';
                                    }
                                    if (this.errors.confirmedMembers) {
                                        errorMessage += ' - Miembros de la familia.<br>';
                                    }
                                    if (this.errors.attendanceStatus) {
                                        errorMessage += ' - Confirmación de asistencia.<br>';
                                    }
                                    this.errorMessage = errorMessage;
                                }
                            }
                        },
                    });

                    modalApp.mount('#dynamic-form'); // Mount the new Vue instance to the modal's form

                },
            });
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
                                    <input class="form-check-input" type="checkbox" :value="miembro" v-model="confirmedMembers">
                                    <label class="form-check-label">{{ miembro }}</label>
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
<li style="margin-top:5%;">
Ser puntuales
</li>
<li style="margin-top:5%;">
La confirmación debe ser enviada antes del 1 de diciembre.
</li>
<li style="margin-top:5%;">
Si no puedes asistir, por favor avísanos con al menos 48 horas de antelación.
</li>
<li style="margin-top:5%;">
Llevar Traje de baño
</li>
</ul>
            `,
            })
        },
        regalos() {
            Swal.fire({
                showCloseButton: true,
                showCancelButton: false,
                showConfirmButton: false,
                html: `
        <h4 class="heading-4">Regalos</h4>

<p class="place" style="text-align:start !important; margin-top:15%;">
Para ayudarnos a construir nuestro hogar juntos. Si desean hacerlo, aquí está nuestros datos:
</p>
<p class="place" style="text-align:start !important; margin-top:0;">Banco Galicia</p>
<p class="place" style="text-align:start !important; margin-top:0;">DU: 44256892</p>
<p class="place" style="text-align:start !important; margin-top:0;">CTA: 4110591-4 081-5</p>
<p class="place" style="text-align:start !important; margin-top:0;">CBU: 0070081830004110591451</p>
<p class="place" style="text-align:start !important; margin-top:0;">CUIL: 20442568929</p>
<p class="place" style="text-align:start !important; margin-top:0;">ALIAS: INCA.ORGANO.CUBITO</p>
            `,
            })
        },

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
