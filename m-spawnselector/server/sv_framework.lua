local callF = pcall
local isQB = Config.Framework == "qbcore"
function getFramework()
    local Core = {}
    if Config.Framework == "qbcore" then 
        local success, error = callF(function()
            Core = exports[Config.FrameworkCustomName or "qb-core"]:GetCoreObject()
        end)
        if not success then 
            TriggerEvent('QBCore:GetObject', function(obj) 
                Core = obj 
            end)
        end
    else
        local success, error = callF(function()
            Core = exports[Config.FrameworkCustomName or "es_extended"]:getSharedObject()
        end)
        if not success then
            TriggerEvent('esx:getSharedObject', function(obj) Core = obj end)
        end
    end
    return Core
end

Framework = getFramework()

function Framework.GetPlayer(source)
    if isQB then
        return Framework.Functions.GetPlayer(source)
    else
        return Framework.GetPlayerFromId(source)
    end
end

function Framework.GetPlayerByIdentifier(identifier)
    if isQB then
        return Framework.Functions.GetPlayerByCitizenId(identifier)
    else
        return Framework.GetPlayerFromIdentifier(identifier)
    end
end

function Framework.CreateCallback(name, func)
    if isQB then
        Framework.Functions.CreateCallback(name, function(source, cb, ...)
            cb(func(source, ...))
        end)
    else
        Framework.RegisterServerCallback(name, function(source, cb, ...)
            cb(func(source, ...))
        end)
    end
end

function Framework.GetIdentifier(source)
    local player = Framework.GetPlayer(source)
    if not player then return false end
    
    if isQB then
        return player.PlayerData.citizenid
    else
        return player.identifier
    end
end

function Framework.GetLicense(source)
    local player = Framework.GetPlayer(source)
    if not player then return false end
    
    if isQB then
        return player.PlayerData.license
    else
        return player.getIdentifier()
    end
end

function Framework.GetPlayerName(source)
    local player = Framework.GetPlayer(source)
    if not player then return false end
    
    if isQB then
        return player.PlayerData.charinfo.firstname .. " " .. player.PlayerData.charinfo.lastname
    else
        return player.name
    end
end

function Framework.GetPlayerMoney(source, type)
    local player = Framework.GetPlayer(source)
    if not player then return false end
    if isQB then
        return type == "bank" and player.PlayerData.money["bank"] or player.PlayerData.money["cash"]
    else
        local esxType = type == "bank" and "bank" or "money"
        return player.getAccount(esxType).money
    end
end

function Framework.GiveMoney(source, type, amount)
    local player = Framework.GetPlayer(source)
    if not player then return false end
    if isQB then
        player.Functions.AddMoney(type, amount)
    else
        local esxType = type == "bank" and "bank" or "money"
        player.addAccountMoney(esxType, amount, reason)
    end
end

function Framework.RemoveMoney(source, type, amount)
    local player = Framework.GetPlayer(source)
    if not player then return false end
    if isQB then
        player.Functions.RemoveMoney(type, amount)
    else
        local esxType = type == "bank" and "bank" or "money"
        player.removeAccountMoney(esxType, amount, reason)
    end
end

function Framework.HasPermission(source, permission)
    if isQB then
        return Framework.Functions.HasPermission(source, permission)
    else
        local player = Framework.GetPlayer(source)
        return player.getGroup() == permission
    end
end

function Framework.Notify(source, msg, type)
    if isQB then
        Framework.Functions.Notify(source, msg, type)
    else
        if Framework.ShowNotification then
            Framework.ShowNotification(source, msg)
        else
            local player = Framework.GetPlayer(source)
            player.showNotification(msg)
        end
    end
end

function ExecuteSQL(query, params)
    local IsBusy = true
    local result = nil
    
    if SVConfig.Database == "oxmysql" then
        exports.oxmysql:execute(query, params, function(data)
            result = data
            IsBusy = false
        end)
    
    elseif SVConfig.Database == "ghmattimysql" then
        exports.ghmattimysql:execute(query, params, function(data)
            result = data
            IsBusy = false
        end)
    elseif SVConfig.Database == "mysql-async" then
        exports['mysql-async']:mysql_fetch_all(query, params, function(data)
            result = data
            IsBusy = false
        end)
    end
    
    while IsBusy do
        Citizen.Wait(0)
    end
    return result
end
