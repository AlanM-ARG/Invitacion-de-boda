const { createApp } = Vue

createApp({
    data() {
        return {
            message: 'Hello Vue!',
            titulo: 'Reproductor de Música con Vue.js',
            currentTime: 0,
            duration: 0,
            isPlaying: false,
            audio: null
        }
    },
    created() {

    },
    methods: {
        togglePlayPause() {
            // Alternar entre reproducir y pausar
            if (this.isPlaying) {
                this.audio.pause();
            } else {
                this.audio.play();
            }
            this.isPlaying = !this.isPlaying;
        },
        loadData() {
            Swal.fire({
                html: `
    <div class="w-form">
                <form id="wf-form-Formulario-de-asistencia" name="wf-form-Formulario-de-asistencia"
                    data-name="Formulario de asistencia" method="get" class="form"
                    data-wf-page-id="66e0ed2af62bed3c21fc1c84"
                    data-wf-element-id="f5234190-0eb5-a102-8c91-431af00f9464">
                    <h4 class="heading-4">¿Asistes a la celebración? </h4><label for="Family">Familia:</label><select
                        id="Family" name="Family" data-name="Family" required="" class="select-field w-select">
                        <option value="">Seleccionar familia...</option>
                        <option value="García">Familia García</option>
                        <option value="Morua">Familia Morua</option>
                        <option value="Casco">Familia Casco</option>
                    </select><label for="nameMembers">Miembros de la familia:</label>
                    <div class="w-layout-hflex checkboxes"><label class="w-checkbox"><input type="checkbox"
                                id="checkbox" name="checkbox" data-name="Checkbox" class="w-checkbox-input"><span
                                class="w-form-label" for="checkbox">Familiar 1</span></label><label
                            class="w-checkbox"><input type="checkbox" id="checkbox-2" name="checkbox-2"
                                data-name="Checkbox 2" class="w-checkbox-input"><span class="w-form-label"
                                for="checkbox-2">Familiar 2</span></label><label class="w-checkbox"><input
                                type="checkbox" id="checkbox-2" name="checkbox-2" data-name="Checkbox 2"
                                class="w-checkbox-input"><span class="w-form-label" for="checkbox-2">Familiar
                                3</span></label><label class="w-checkbox"><input type="checkbox" id="checkbox-2"
                                name="checkbox-2" data-name="Checkbox 2" class="w-checkbox-input"><span
                                class="w-form-label" for="checkbox-2">Familiar 4</span></label><label
                            class="w-checkbox"><input type="checkbox" id="checkbox-2" name="checkbox-2"
                                data-name="Checkbox 2" class="w-checkbox-input"><span class="w-form-label"
                                for="checkbox-2">Familiar 5</span></label><label class="w-checkbox"><input
                                type="checkbox" id="checkbox-2" name="checkbox-2" data-name="Checkbox 2"
                                class="w-checkbox-input"><span class="w-form-label" for="checkbox-2">Familiar
                                6</span></label></div><label for="nameMembers">Confirmar asistencia:</label><label
                        class="w-radio"><input type="radio" name="Confirmacion" id="true" data-name="Confirmacion"
                            required="" class="w-form-formradioinput w-radio-input" value="true"><span
                            class="w-form-label" for="true">Sí, confirmo por los seleccionados</span></label><label
                        class="w-radio"><input type="radio" name="Confirmacion" id="false" data-name="Confirmacion"
                            class="w-form-formradioinput w-radio-input" value="false"><span class="w-form-label"
                            for="false">No, no puedo asistir</span></label><label for="field">Información
                        Adicional:</label><textarea required=""
                        placeholder="Ingrese algún dato Importante. Ej: Soy Vegetariano" maxlength="5000" id="field"
                        name="field" data-name="Field" class="w-input"></textarea>
                    <div class="w-layout-hflex flex-block-2">
                        <a href="#" class="button w-button">Enviar</a>
                    </div>
                    <div class="w-layout-blockcontainer w-container">
                        <h1><strong class="bold-text">Alan &amp; Ailiin</strong></h1>
                        <h2 class="heading-2 firstdate">¡Los esperamos!</h2>
                    </div>
                </form>

            </div>
  `     });
        }
    },
    mounted() {
        // Acceder al elemento de audio
        this.audio = this.$refs.audio;

        // Verificar si el elemento de audio está disponible
        if (this.audio) {
            // Actualizar la duración y el tiempo actual del audio
            this.audio.onloadedmetadata = () => {
                this.duration = this.audio.duration;
            };
            this.audio.ontimeupdate = () => {
                this.currentTime = this.audio.currentTime;
            };
            // Detectar cuándo termina el audio para restablecer el estado
            this.audio.onended = () => {
                this.isPlaying = false;
            };
        };
    }
}).mount('#app')