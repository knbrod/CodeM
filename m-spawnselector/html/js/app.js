import selectorModule from './modules/selector.js';

const Modules = {
    selector: selectorModule,
}

import selectorPage from '../pages/selector/index.js';

var resourceName = 'm-spawnselector'

if (window.GetParentResourceName) {
    resourceName = window.GetParentResourceName()
}

window.postNUI = async (name, data) => {
    try {
        const response = await fetch(`https://${resourceName}/${name}`, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(data)
        });
        return !response.ok ? null : response.json ? response.json() : response;
    } catch (error) {
        // console.log(error)
    }
}

window.vectorToString = (vector) => {
    return vector.replace ? vector.replace('vector3(', '').replace(')', '').split(',').map((v) => parseFloat(v)) : vector;
}

window.stringToVector = (vector) => {
    return `vector3(${vector.x.toFixed(2)}, ${vector.y.toFixed(2)}, ${vector.z.toFixed(2)})`;
}

const store = Vuex.createStore({
    state: {
        display: false,
        activePage: 'selector',

        selectedSpawn: null,

        player: {
            name: 'Alec Tomoveit',
            job: 'LSPD - Officer',
            avatar: 'https://cdn.discordapp.com/attachments/1102219196127006740/1102219662663635045/Rectangle_2302.png'
        },

        modalActive: false,
        modalContent: {},
        modalPromise: null,
        modalValid: false,

        config: {
            welcomeMessage: "Welcome to the M City !"
        }
    },
    mutations: {},
    actions: {
        async showModal({ state }, modal) {
            state.modalActive = true;
            state.modalContent = modal;
            const promise = await new Promise((resolve, reject) => {
                state.modalPromise = { resolve, reject };
            });
            state.modalActive = false;
            state.modalContent = {};
            return promise;
        }
    },
    modules: Modules
});

const app = Vue.createApp({
    components: {
        'selector': selectorPage,
    },
    data: () => ({
    }),

    watch: {
        activePage() {
            this.$nextTick(() => {
                this.updateNavbarActive();
            });
        }
    },

    async mounted() {
        document.querySelector('#app').style.display = 'block'
        window.addEventListener('resize', this.updateNavbarActive);
        this.$nextTick(() => {
            this.updateNavbarActive();
        });

        const gameData = await postNUI("ready")
        this.$store.state.config = gameData.config;
        this.$store.state.selector.isQBCore = gameData.isQBCore;

        window.addEventListener('message', (event) => {
            const data = event.data;
            if (data.type == 'openSelector') {
                this.$store.state.display = true;
                this.$store.state.player = data.player;
                this.$store.state.selector.isEditor = data.editor;
                this.$store.state.selector.playersAround = data.playersAround;
                this.$store.state.selector.jobSpawns = data.jobSpawns.locations;
                this.$store.state.selector.defaultSpawn = data.jobSpawns.default;
                this.$store.state.selectedSpawn = null;
                var spawnLocations = data.locations;
                spawnLocations.forEach((spawn) => {
                    spawn.coords = stringToVector(spawn.coords);
                    spawn.camCoords = stringToVector(spawn.camCoords);
                    spawn.camRotation = stringToVector(spawn.camRotation);
                })
                this.$store.state.selector.spawnLocations = spawnLocations
            } else if (data.type == 'closeSelector') {
                this.$store.state.display = false;
            } else if (data.type == 'updateLocations') {
                var spawnLocations = data.locations;
                spawnLocations.forEach((spawn) => {
                    spawn.coords = stringToVector(spawn.coords);
                    spawn.camCoords = stringToVector(spawn.camCoords);
                    spawn.camRotation = stringToVector(spawn.camRotation);
                })
                this.$store.state.selector.spawnLocations = spawnLocations
            } else if (data.type == 'CHECK_NUI_READY') {
                postNUI("nuiReady")
            }
        });

        window.addEventListener('keydown', (event) => {
            if (event.key == 'Escape') {
                if (this.$store.state.display && this.$store.state.selector.isEditor) {
                    postNUI("closeSelector")
                }
            }
        });
    },

    beforeDestroy() {
        window.removeEventListener('resize', this.updateNavbarActive);
    },

    methods: {
        setActivePage(page) {
            this.$store.state.activePage = page;
        },
        async updateNavbarActive() {
            const activePageRef = await this.$refs[`navitem-${this.activePage}`]
            const navbarActiveRef = await this.$refs.navbarActive;
            if (!activePageRef || !navbarActiveRef) {
                return {
                    opacity: 0,
                    left: "50%"
                };
            };
            const pageRef = activePageRef[0];
            const pageRefCenter = pageRef.offsetLeft + pageRef.clientWidth / 2;
            navbarActiveRef.style.left = `${pageRefCenter - navbarActiveRef.clientWidth / 2}px`
        },
        modalButtonHandler(value) {
            const state = this.$store.state;
            if (state.modalPromise) {
                if (value) {
                    if (state.modalContent?.content == "input") {
                        return state.modalPromise.resolve(this.modalContent.input);
                    }
                    if (state.modalContent?.type == "new-spawn") {
                        var obj = {}
                        for (const input of state.modalContent.fields) {
                            if (input.required && !input.value) {
                                return;
                            }
                            obj[input.name] = input.value;
                        }
                        return state.modalPromise.resolve(obj);
                    }

                    if (state.modalContent?.type == 'custom-plate') {
                        const plate = this.modalContent.input
                        return state.modalPromise.resolve(plate);
                    }
                }
                state.modalPromise.resolve(value);
            }
        },
        closeModal() {
            this.$store.state.modalActive = false;
            if (this.$store.state.modalPromise) {
                this.$store.state.modalPromise.resolve(false);
            }
        },
        findModalInput(name, key) {
            const input = this.$store.state.modalContent.fields.find((input) => input.name == name)
            return key ? input[key] : input;
        },
        // checkRules(name) {
        //     const input = this.findModalInput(name);
        //     if (input.rules) {
        //         for (const rule of input.rules) {
        //             const ruleResult = rule(input.value);
        //             if (input.value && ruleResult != true && (input.required || input.value)) {
        //                 this.$store.state.modalValid = false;
        //                 input.error = ruleResult;
        //                 return true;
        //             } else if (!input.value && input.required) {
        //                 this.$store.state.modalValid = false;
        //                 input.error = ruleResult;
        //                 return true;
        //             }
        //         }
        //     }
        //     this.$store.state.modalValid = true;
        //     input.error = null;
        //     return false;
        // },
        async getCameraPosition() {
            const camera = await postNUI("getCamPos");
            const coords = this.findModalInput("camCoords");
            const rotation = this.findModalInput("camRotation");
            
            const camPos = JSON.parse(camera.cam);
            const camRot = JSON.parse(camera.rot);

            coords.value = `vector3(${camPos.x.toFixed(2)}, ${camPos.y.toFixed(2)}, ${camPos.z.toFixed(2)})`;
            rotation.value = `vector3(${camRot.x.toFixed(2)}, ${camRot.y.toFixed(2)}, ${camRot.z.toFixed(2)})`;
        }
    },

    computed: {
        ...Vuex.mapState({
            modalActive: state => state.modalActive,
            activePage: state => state.activePage,
            modalContent: state => state.modalContent,
            modalValid: state => state.modalValid,
            isEditor: state => state.selector.isEditor,
            display: state => state.display,
            config: state => state.config,
            player: state => state.player,
            selectedSpawn: state => state.selectedSpawn,
        })
    },
});

app.use(store).mount('#app');