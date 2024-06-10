SVConfig = {
    Database = "oxmysql", -- oxmysql | ghmattimysql | mysql-async
    discordToken = "",
    spawnLocations = { -- this locations will be inserting in to sql for the first time and script get the locations from sql after that
        {
            point = "International Airport",
            state = "Los Santos",
            coords = vector3(-1037.95, -2737.75, 20.17),
            camCoords = vector3(-1040.95, -2737.75, 20.17),
            camRotation = vector3(0.0, 0.0, 0.0),
            heading = 330.1,
            cardColor = "#00D1FF",
            buttonColor = "#00D1FF",
            buttonText = "#008A89",
            cardImage = "../../assets/location-airport.png",
            id = 0
        },
        {
            point = "Vespucci Beach",
            state = "Los Santos",
            coords = vector3(-1376.15, -1206.04, 4.45),
            camCoords = vector3(-1376.15, -1206.04, 4.45),
            camRotation = vector3(0.0, 0.0, 0.0),
            heading = 84.54,
            cardColor = "#FFDA03",
            buttonColor = "#FFDA03",
            buttonText = "#865D00",
            cardImage = "../../assets/location-demo.png",
            id = 1
        },
        {
            point = "Pink Cage Motel",
            state = "Los Santos",
            coords = vector3(314.43, -240.37, 54.02),
            camCoords = vector3(314.43, -240.37, 54.02),
            camRotation = vector3(0.0, 0.0, 0.0),
            heading = 335.9,
            cardColor = "#EB00FF",
            buttonColor = "#EB00FF",
            buttonText = "#610468",
            cardImage = "../../assets/location-pinkcage.png",
            id = 2
        },
        {
            point = "Southside Mall",
            state = "Los Santos",
            coords = vector3(26.18, -1729.9, 29.3),
            camCoords = vector3(26.18, -1729.9, 29.3),
            camRotation = vector3(0.0, 0.0, 0.0),
            heading = 33.06,
            cardColor = "#03F872",
            buttonColor = "#03F872",
            buttonText = "#026831",
            cardImage = "../../assets/location-ssmall.png",
            id = 3
        },
        {
            point = "County Sheriff",
            state = "Sandy Shores",
            coords = vector3(1858.72, 3676.69, 33.66),
            camCoords = vector3(1858.72, 3676.69, 33.66),
            camRotation = vector3(0.0, 0.0, 0.0),
            heading = 35.3,
            cardColor = "#FFDC61",
            buttonColor = "#FFDC61",
            buttonText = "#857437",
            cardImage = "../../assets/location-sandysheriff.png",
            id = 4
        },
    },
    jobSpawnLocations = {
        ["police"] = {
            name = "LSPD Mission Row",
            coords = vector3(425.26, -985.23, 30.71),
            heading = 352.88
        },
    },
    defaultJobSpawn = {
        name = "Alta Street",
        coords = vector3(-253.43, -975.32, 31.21),
        heading = 0
    },
    getPlayerApartmentQuery = "SELECT * FROM `apartments` WHERE `citizenid` = @identifier", -- only has @identifier as a parameter  
    EnableCommand = true, -- if you want to use command to open admin editor
    Command = "spawnedit", -- command name
    CommandPermission = "god", -- command permission
}


Citizen.CreateThread(function()
    if Config.VersionChecker then
        local resource_name = 'codeM-spawnselector'
        local current_version = GetResourceMetadata(GetCurrentResourceName(), 'version', 0)
        PerformHttpRequest('https://raw.githubusercontent.com/Aiakos232/versionchecker/main/version.json',
            function(error, result, headers)
                if not result then
                    print('^1Version check disabled because github is down.^0')
                    return
                end
                local result = json.decode(result)
                if tonumber(result[resource_name]) ~= nil then
                    if tonumber(result[resource_name]) > tonumber(current_version) then
                        print('\n')
                        print('^1======================================================================^0')
                        print('^1' .. resource_name ..
                            ' is outdated, new version is available: ' .. result[resource_name] .. '^0')
                        print('^1======================================================================^0')
                        print('\n')
                    elseif tonumber(result[resource_name]) == tonumber(current_version) then
                        print('^2' .. resource_name .. ' is up to date! -  ^4 Thanks for choose CodeM ^4 ^0')
                    elseif tonumber(result[resource_name]) < tonumber(current_version) then
                        print('^3' .. resource_name .. ' is a higher version than the official version!^0')
                    end
                else
                    print('^1' .. resource_name .. ' is not in the version database^0')
                end
            end, 'GET')
    end
end)