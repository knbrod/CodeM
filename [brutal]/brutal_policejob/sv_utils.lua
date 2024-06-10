local YourWebhook = 'WEBHOOK-HERE'  -- help: https://docs.brutalscripts.com/site/others/discord-webhook

function GetWebhook()
    return YourWebhook
end

-- Buy here: (4€+VAT) https://store.brutalscripts.com
function notification(source, title, text, time, type)
    if Config.BrutalNotify then
        TriggerClientEvent('brutal_notify:SendAlert', source, title, text, time, type)
    else
        TriggerClientEvent('brutal_policejob:client:DefaultNotify', text)
    end
end

function ClearPlayerInventory(source)
    if Config.Inventory:lower() == 'ox_inventory' then
        exports.ox_inventory:ClearInventory(source)
    elseif Config.Inventory:lower() == 'quasar_inventory' then
        local saveItems = {
            'id_card', -- Add here the items that you do NOT want to be deleted
            'phone',
        }
        exports['qs-inventory']:ClearInventory(source, saveItems)
        local weapons = exports['qs-inventory']:GetWeaponList()
        for k,v in pairs(weapons) do
            RemoveItem(source, v.name, 1)
        end
    elseif Config.Inventory:lower() == 'qb_inventory' then
        exports['qb-inventory']:ClearInventory(source)
    elseif Config['Core']:upper() == 'ESX' then
        local ESX = Core
        local xPlayer = ESX.GetPlayerFromId(source)
        for i=1, #xPlayer.inventory, 1 do
            if xPlayer.inventory[i].count > 0 then
                xPlayer.setInventoryItem(xPlayer.inventory[i].name, 0)
            end
        end
    elseif Config.Inventory:lower() == 'codem_inventory' then
        exports["codem-inventory"]:ClearInventory(source)
    end
end

RESCB('brutal_policejob:server:isPlayerDead', function(source, cb, player)
    if Config['Core']:upper() == 'ESX' then
        MySQL.Async.fetchAll('SELECT * FROM users WHERE identifier = @identifier', { ['@identifier'] = GetIdentifier(player)}, function(results)
            if results[1].is_dead == true or results[1].is_dead == 1 then
                death = true
            else
                death = false
            end
        end)
    elseif Config['Core']:upper() == 'QBCORE' then
        death = GetPlayerDeathMetaData(source) or false
    end
    cb(death)
end)

function SocietyAddMoney(job, price)
    if Config['Core']:upper() == 'ESX' then
        local society = exports['esx_society']:GetSociety(job)
        TriggerEvent('esx_addonaccount:getSharedAccount', society.account, function(account)
            account.addMoney(price)
        end)
    else
        exports['qb-management']:AddMoney(job, price)
    end
end