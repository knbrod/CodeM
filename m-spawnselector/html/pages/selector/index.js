import importTemplate from '../../js/util/importTemplate.js';
import inlineSvg from '../../js/util/inlineSvg.js';

export default {
    template: await importTemplate('pages/selector/index.html'),
    components: {
        'inline-svg': inlineSvg
    },
    data: () => ({
        currentScroll: 0,
        timeout: null,
    }),

    mounted() {
        this.scrollToLocation(false)

        this.updateScroll()
    },

    methods: {
        selectLocation(location) {
            this.$store.state.selectedSpawn = location;
            postNUI("showSpawn", this.$store.state.selectedSpawn)

        },

        scrollLocations(event) {
            if (this.timeout) return;
            this.timeout = setTimeout(() => {
                this.timeout = null;
            }, 750);
            const isScrollNext = event.deltaY < 0;
            this.scrollToLocation(isScrollNext)
        },

        scrollToLocation(isScrollNext) {
            this.updateScroll()
            const maxScrolls = Math.ceil(this.spawnLength / 5)
            if (isScrollNext) {
                if (this.currentScroll < maxScrolls - 1) {
                    this.currentScroll++;
                }
            } else {
                if (this.currentScroll > 0) {
                    this.currentScroll--;
                }
            }

            const currentScroll = this.isEditor && this.currentScroll == 0 ? 'new' : this.currentScroll * 5;
            const firstItem = this.$refs[`location-${currentScroll}`] && this.$refs[`location-${currentScroll}`][0] || this.$refs[`location-${currentScroll}`]

            if (firstItem) {
                const locationWrapper = this.$refs.locationsWrapper;
                const locationsScroll = this.$refs.locationsScroll;
                const scrollFill = locationsScroll.querySelector('.scroll-fill');

                locationWrapper.scrollTo({
                    left: firstItem.offsetLeft - 50,
                    behavior: 'smooth',
                })

                var timeout = 750
                var interval
                interval = setInterval(() => {
                    const scrollPercent = locationWrapper.scrollLeft / (locationWrapper.scrollWidth - locationWrapper.clientWidth);
                    const fillWidth = scrollFill.clientWidth;
                    const left = scrollPercent * (locationsScroll.clientWidth - fillWidth) + 'px';
                    scrollFill.style.left = left;
                    timeout -= 10;

                    if (timeout <= 0) {
                        clearInterval(interval);
                    }
                }, 10);
            }
        },

        selectSpawn(hasType) {
            const selectedSpawn = this.$store.state.selectedSpawn
            if (!hasType) {
                selectedSpawn.coords = vectorToString(selectedSpawn.coords);
                selectedSpawn.camCoords = vectorToString(selectedSpawn.camCoords);
                selectedSpawn.camRotation = vectorToString(selectedSpawn.camRotation);
            }
            postNUI("selectSpawn", hasType ? hasType : selectedSpawn)
        },

        newLocation() {
            this.$store.dispatch('showModal', {
                title: 'Add New Spawn Point',
                content: 'form',
                type: 'new-spawn',
                fields: [
                    {
                        name: 'state',
                        placeholder: 'Location State Name',
                        maxlength: 35,
                        required: true,
                    },
                    {
                        name: 'point',
                        placeholder: 'Location Point Name',
                        maxlength: 35,
                        required: true,
                    },
                    {
                        name: 'cardImage',
                        placeholder: 'Location Card Image',
                        required: true,
                    },
                    {
                        name: 'coords',
                        placeholder: 'Location Coords (vector3)',
                        required: true,
                    },
                    {
                        name: 'heading',
                        placeholder: 'Location Heading',
                        required: true,
                    },
                    {
                        name: 'camCoords',
                        placeholder: 'Location Camera',
                        required: true,
                        button: {
                            type: 'cam',
                            text: "Get Coords",
                            handler: async (value) => {
                                const camera = await postNUI("getCamPos");
                                const coords = this.findModalInput("camCoords");

                                const camPos = JSON.parse(camera.cam);

                                coords.value = `vector3(${camPos.x.toFixed(2)}, ${camPos.y.toFixed(2)}, ${camPos.z.toFixed(2)})`;
                            }
                        }
                    },
                    {
                        name: 'camRotation',
                        placeholder: 'Location Camera Rotation',
                        required: true,
                        button: {
                            type: 'rot',
                            text: "Get Coords",
                            handler: async (value) => {
                                const camera = await postNUI("getCamPos");
                                const rotation = this.findModalInput("camRotation");

                                const camRot = JSON.parse(camera.rot);

                                rotation.value = `vector3(${camRot.x.toFixed(2)}, ${camRot.y.toFixed(2)}, ${camRot.z.toFixed(2)})`
                            }
                        }
                    },
                    {
                        name: 'cardColor',
                        placeholder: 'Card Color (RGBA)',
                        // value: '#000000',
                        button: {
                            type: 'color',
                            text: "Color Picker",
                        }
                    },
                    {
                        name: "buttonColor",
                        placeholder: "Button Color (RGBA)",
                        // value: '#000000',
                        button: {
                            type: 'color',
                            text: "Color Picker",
                        }
                    },
                    {
                        name: "buttonText",
                        placeholder: "Button Text (RGBA)",
                        // value: '#000000',
                        button: {
                            type: 'color',
                            text: "Color Picker",
                        }
                    },
                ],
                buttons: [
                    {
                        text: "Add",
                        class: "green",
                        value: true
                    },
                    {
                        text: "Cancel",
                        class: "gray",
                        value: false
                    }
                ]
            }).then((result, cb) => {
                if (!result) return;

                const spawn = {
                    state: result.state,
                    point: result.point,
                    cardImage: result.cardImage,
                    coords: result.coords,
                    heading: result.heading,
                    camCoords: result.camCoords,
                    camRotation: result.camRotation,
                    cardColor: result.cardColor,
                    buttonColor: result.buttonColor,
                    buttonText: result.buttonText,
                }

                this.$store.dispatch('selector/addSpawn', spawn)
            });
        },
        editLocation(spawnData) {
            this.$store.dispatch('showModal', {
                title: 'Add New Spawn Point',
                content: 'form',
                type: 'new-spawn',
                fields: [
                    {
                        name: 'state',
                        value: spawnData.state,
                        placeholder: 'Location State Name',
                        maxlength: 35,
                        required: true,
                    },
                    {
                        name: 'point',
                        value: spawnData.point,
                        placeholder: 'Location Point Name',
                        maxlength: 35,
                        required: true,
                    },
                    {
                        name: 'cardImage',
                        value: spawnData.cardImage,
                        placeholder: 'Location Card Image',
                        required: true,
                    },
                    {
                        name: 'coords',
                        value: spawnData.coords,
                        placeholder: 'Location Coords (vector3)',
                        required: true,
                    },
                    {
                        name: 'heading',
                        value: spawnData.heading,
                        placeholder: 'Location Heading',
                        required: true,
                    },
                    {
                        name: 'camCoords',
                        value: spawnData.camCoords,
                        placeholder: 'Location Camera',
                        required: true,
                        button: {
                            type: 'cam',
                            text: "Get Coords",
                            handler: async (value) => {
                                const camera = await postNUI("getCamPos");
                                const coords = this.findModalInput("camCoords");

                                const camPos = JSON.parse(camera.cam);

                                coords.value = `vector3(${camPos.x.toFixed(2)}, ${camPos.y.toFixed(2)}, ${camPos.z.toFixed(2)})`;
                            }
                        }
                    },
                    {
                        name: 'camRotation',
                        value: spawnData.camRotation,
                        placeholder: 'Location Camera Rotation',
                        required: true,
                        button: {
                            type: 'rot',
                            text: "Get Coords",
                            handler: async (value) => {
                                const camera = await postNUI("getCamPos");
                                const rotation = this.findModalInput("camRotation");

                                const camRot = JSON.parse(camera.rot);

                                rotation.value = `vector3(${camRot.x.toFixed(2)}, ${camRot.y.toFixed(2)}, ${camRot.z.toFixed(2)})`
                            }
                        }
                    },
                    {
                        name: 'cardColor',
                        value: spawnData.cardColor,
                        placeholder: 'Card Color (RGBA)',
                        button: {
                            type: 'color',
                            text: "Color Picker",
                            handler: (value) => {
                            }
                        }
                    },
                    {
                        name: "buttonColor",
                        value: spawnData.buttonColor,
                        placeholder: "Button Color (RGBA)",
                        button: {
                            type: 'color',
                            text: "Color Picker",
                            handler: (value) => {
                            }
                        }
                    },
                    {
                        name: "buttonText",
                        value: spawnData.buttonText,
                        placeholder: "Button Text (RGBA)",
                        button: {
                            type: 'color',
                            text: "Color Picker",
                            handler: (value) => {
                            }
                        }
                    },
                ],
                buttons: [
                    {
                        text: "Edit",
                        class: "green",
                        value: true
                    },
                    {
                        text: "Cancel",
                        class: "gray",
                        value: false
                    }
                ]
            }).then((result, cb) => {
                if (!result) return;

                const spawn = {
                    id: spawnData.id,
                    state: result.state,
                    point: result.point,
                    cardImage: result.cardImage,
                    coords: result.coords,
                    heading: result.heading,
                    camCoords: result.camCoords,
                    camRotation: result.camRotation,
                    cardColor: result.cardColor,
                    buttonColor: result.buttonColor,
                    buttonText: result.buttonText,
                }

                this.$store.dispatch('selector/editLocation', spawn)
            });
        },
        deleteLocation(spawnData) {
            this.$store.dispatch('showModal', {
                title: 'Are You Sure To Delete This Point',
                text: spawnData.point,
                content: 'text',
                buttons: [
                    {
                        text: "Delete",
                        class: "red",
                        value: true
                    },
                    {
                        text: "Cancel",
                        class: "gray",
                        value: false
                    }
                ]
            }).then((result, cb) => {
                if (!result) return;

                this.$store.dispatch('selector/deleteLocation', spawnData.id)
            });
        },

        updateScroll() {
            const locationsScroll = this.$refs.locationsScroll;
            const scrollFill = locationsScroll.querySelector('.scroll-fill');
            const widthPercent = 100 / Math.ceil(this.spawnLength / 5);
            scrollFill.style.width = `${widthPercent}%`;
        },

        findModalInput(name, key) {
            const input = this.$store.state.modalContent.fields.find((input) => input.name == name)
            return key ? input[key] : input;
        },
    },

    computed: {
        ...Vuex.mapState({
            selectedSpawn: state => state.selectedSpawn,
            spawns: state => state.selector.spawnLocations,
            jobSpawns: state => state.selector.jobSpawns,
            quickSelect: state => state.selector.quickSelect,
            playersAround: state => state.selector.playersAround,
            isQBCore: state => state.selector.isQBCore,
            isEditor: state => state.selector.isEditor,
            config: state => state.config,
            player: state => state.player,
            defaultSpawn: state => state.selector.defaultSpawn,
        }),
        spawnLength() {
            return this.spawns.length + (this.isEditor ? 1 : 0)
        },
        currentJobSpawn() {
            return this.jobSpawns[this.player.job] || this.defaultSpawn
        }
    },

    watch: {
        spawns() {
            this.scrollToLocation(false)
            this.updateScroll()
        },
    },
}