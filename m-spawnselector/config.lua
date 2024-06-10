Config = {
    UI = {
        ppType = "steam", -- steam or discord
        welcomeMessage = "Welcome to the M City !",
    },
    Framework = "qbcore", -- esx or qbcore
    SQLLastPosition = false, -- if you want to save last position to sql, set this to true
    FrameworkCustomName = false, -- if you have custom framework name, set this to your framework name or leave it false
    UseAparmentSystem = true, -- if you have apartment system, set this to true
    VersionChecker = true, -- if you want to use version checker, set this to true
    CreateTrigger = function()
        if Config.Framework == 'qbcore' then
            RegisterNetEvent("m-spawnselector:client:display", function(playerData, isNew)
                OpenSelector(false, {
                    playerData = playerData,
                    isNew = isNew
                }) 
            end)
        else
            --for esx
            RegisterNetEvent("m-spawnselector:client:display", function(spawn, isNew, skin)
                OpenSelector(false, {
                    spawn = spawn,
                    isNew = isNew,
                    skin = skin
                }) -- never remove this
            end)
        end
    end,

    OnSpawnSelected = function(location, cbArgs)
        if Config.Framework == 'qbcore' then
            -- this part is for qbcore

            local ped = PlayerPedId()
            if location == "apartment" then
                local playerApartment = Framework.TriggerCallback("m-spawnselector:getPlayerApartment")
                if not playerApartment then
                    TriggerServerEvent("apartments:server:CreateApartment", "apartment1", "South Rockford Drive")
                else
                    local apartmentType = playerApartment.type
                    local apartmentId = playerApartment.id
                    TriggerEvent('qb-apartments:client:LastLocationHouse', apartmentType, apartmentId)
                end
                FreezeEntityPosition(ped, false)
                SetEntityVisible(ped, true)
                TriggerServerEvent('QBCore:Server:OnPlayerLoaded')
                TriggerEvent('QBCore:Client:OnPlayerLoaded')
                DoScreenFadeOut(100)
            elseif location == "last" then
                local position = Framework.GetPlayerLastPosition()
                SetEntityCoords(ped, position.x, position.y, position.z)
                SetEntityHeading(ped, position.a)
                FreezeEntityPosition(ped, false)
                SetEntityVisible(ped, true)
                TriggerServerEvent('QBCore:Server:OnPlayerLoaded')
                TriggerEvent('QBCore:Client:OnPlayerLoaded')
            elseif location == "job" then
                local playerJob = Framework.GetPlayerJob()
                local spawnData = Framework.TriggerCallback("m-spawnselector:getJobSpawn", playerJob.name)
                if spawnData then
                    local pos = spawnData.coords
                    local heading = spawnData.heading
                    SetEntityCoords(ped, pos.x, pos.y, pos.z)
                    SetEntityHeading(ped, heading)
                    FreezeEntityPosition(ped, false)
                end
                SetEntityVisible(ped, true)
                FreezeEntityPosition(ped, false)
                TriggerServerEvent('QBCore:Server:OnPlayerLoaded')
                TriggerEvent('QBCore:Client:OnPlayerLoaded')
            elseif type(location) == "table" then
                local pos = vector3(location.coords[1], location.coords[2], location.coords[3])
                local heading = location.heading
                SetEntityCoords(ped, pos.x, pos.y, pos.z)
                TriggerServerEvent('QBCore:Server:OnPlayerLoaded')
                TriggerEvent('QBCore:Client:OnPlayerLoaded')
                TriggerServerEvent('qb-houses:server:SetInsideMeta', 0, false)
                TriggerServerEvent('qb-apartments:server:SetInsideMeta', 0, 0, false)
                SetEntityVisible(ped, true)
                FreezeEntityPosition(ped, false)
                Wait(500)
                SetEntityCoords(ped, pos.x, pos.y, pos.z)
                SetEntityHeading(ped, heading)
            end
        else
            -- this part is for esx

            local playerPed = PlayerPedId()
            if cbArgs then
                local spawn = cbArgs.spawn
                local isNew = cbArgs.isNew
                local skin = cbArgs.skin
            end
            FreezeEntityPosition(playerPed, true)
            if type(location) == "table" then
                spawn = vector3(location.coords[1], location.coords[2], location.coords[3])
                heading = location.heading
            end
            if location == 'last' then
                if Config.SQLLastPosition then
                    local lastPosition = Framework.TriggerCallback("spawnselector:sqlLastCoords")
                    local spawnLoc = json.decode(lastPosition.position)
                    spawn = vector3(spawnLoc.x, spawnLoc.y, spawnLoc.z)
                    heading = 100.0
                else
                    local position = Framework.GetPlayerLastPosition()
                    spawn = vector3(position.x, position.y, position.z)
                    heading = position.a
                end

            end
            SetEntityCoordsNoOffset(playerPed, spawn.x, spawn.y, spawn.z, false, false, false, true)
            SetEntityHeading(playerPed, spawn.heading)
            if isNew then
                if not isNew then TriggerEvent('skinchanger:loadSkin', skin or Characters[spawned].skin) end
            end
            Wait(400)
            DoScreenFadeIn(400)
            repeat Wait(200) until not IsScreenFadedOut()
            TriggerServerEvent('esx:onPlayerSpawn')
            TriggerEvent('esx:onPlayerSpawn')
            TriggerEvent('playerSpawned')
            TriggerEvent('esx:restoreLoadout')
            FreezeEntityPosition(playerPed, false)
        end
    end,

    CameraCreated = function(cam)
        SetCamActive(cam, true)
        SetCamDofStrength(cam, 1.0)
        SetCamEffect(cam, 1)
        SetCamFarDof(cam, 10.0)
        SetCamMotionBlurStrength(cam, 1.0)
    end,
}