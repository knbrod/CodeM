const module = {
    namespaced: true,
    state: {
        spawnLocations: [],
        // jobQuickSelect: {
        //     point: "LSPD Mission Row",
        //     id: 0
        // },
        // quickSelect: {
        //     point: "Last Location",
        //     id: 0
        // },
        playersAround: {
            0: 10,
            1: 20,
            2: 30,
            3: 40,
            4: 50,
        },
        jobSpawns: {},
        isQBCore: false,
        isEditor: false,
    },
    actions: {
        addSpawn({ state }, spawn) {
            spawn.coords = vectorToString(spawn.coords);
            spawn.camCoords = vectorToString(spawn.camCoords);
            spawn.camRotation = vectorToString(spawn.camRotation);
            postNUI("addSpawn", spawn)
            spawn.coords = stringToVector({
                x: spawn.coords[0],
                y: spawn.coords[1],
                z: spawn.coords[2]
            });
            spawn.camCoords = stringToVector({
                x: spawn.camCoords[0],
                y: spawn.camCoords[1],
                z: spawn.camCoords[2]
            });
            spawn.camRotation = stringToVector({
                x: spawn.camRotation[0],
                y: spawn.camRotation[1],
                z: spawn.camRotation[2]
            });
            state.spawnLocations.push(spawn)

        },
        editLocation({ state }, spawn) {
            const spawnIndex = state.spawnLocations.findIndex((s) => s.id === spawn.id);
            spawn.coords = vectorToString(spawn.coords);
            spawn.camCoords = vectorToString(spawn.camCoords);
            spawn.camRotation = vectorToString(spawn.camRotation);
            postNUI("editSpawn", spawn)
            spawn.coords = stringToVector({
                x: spawn.coords[0],
                y: spawn.coords[1],
                z: spawn.coords[2]
            });
            spawn.camCoords = stringToVector({
                x: spawn.camCoords[0],
                y: spawn.camCoords[1],
                z: spawn.camCoords[2]
            });
            spawn.camRotation = stringToVector({
                x: spawn.camRotation[0],
                y: spawn.camRotation[1],
                z: spawn.camRotation[2]
            });

            state.spawnLocations[spawnIndex] = spawn;
        },
        deleteLocation({ state }, spawnId) {
            const spawnIndex = state.spawnLocations.findIndex((s) => s.id === spawnId);
            postNUI("deleteSpawn", spawnId)
            state.spawnLocations.splice(spawnIndex, 1);
        }
    }
}

export default module