local fwork = Config.Framework

function getFramework()
    local Core = {}
    if fwork == "qbcore" then 
        local success, error = pcall(function()
            Core = exports[Config.FrameworkCustomName or "qb-core"]:GetCoreObject()
        end)
        if not success then 
            TriggerEvent('QBCore:GetObject', function(obj) 
                Core = obj 
            end)
        end
    else
        local success, error = pcall(function()
            Core = exports[Config.FrameworkCustomName or "es_extended"]:getSharedObject()
        end)
        if not success then
            TriggerEvent('esx:getSharedObject', function(obj) Core = obj end)
        end
    end
    return Core
end

Framework = getFramework()

function Framework.GetIdentifier()
    local playerData = fwork == "qbcore" and Framework.Functions.GetPlayerData() or Framework.GetPlayerData()
    if not playerData then return end
    return fwork == "qbcore" and playerData.citizenid or playerData.identifier
end

function Framework.GetPlayerName()
    local playerData = fwork == "qbcore" and Framework.Functions.GetPlayerData() or Framework.GetPlayerData()
    if not playerData then return end
    return fwrok == "qbcore" and playerData.charinfo.firstname .. " " .. playerData.charinfo.lastname or playerData.name
end

function Framework.GetPlayerDetails()
    local playerData = fwork == "qbcore" and Framework.Functions.GetPlayerData() or Framework.GetPlayerData()
    if not playerData then return end
    
    local details = {} 
    details.name = fwork == "qbcore" and playerData.charinfo.firstname .. " " .. playerData.charinfo.lastname or playerData.name
    details.jobName = playerData.job.label
    details.job = playerData.job.name
    return details
end

function Framework.GetPlayerJob()
    local playerData = fwork == "qbcore" and Framework.Functions.GetPlayerData() or Framework.GetPlayerData()
    if not playerData then return end
    return playerData.job
end

function Framework.GetPlayerLastPosition()
    local playerData = fwork == "qbcore" and Framework.Functions.GetPlayerData() or Framework.GetPlayerData()
    if not playerData then return end
    if fwork == "qbcore" then
        return playerData.position
    else
        return playerData.coords
    end
end

function Framework.TriggerCallback(name, ...)
    local retval = promise:new()
    if fwork == "qbcore" then
        Framework.Functions.TriggerCallback(name, function(...)
            retval:resolve(...)
        end, ...)
    else
        Framework.TriggerServerCallback(name, function(...)
            retval:resolve(...)
        end, ...)
    end
    return Citizen.Await(retval)
end