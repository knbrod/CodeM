fx_version "cerulean"

description "codem store"
author "CODEM"
version "1.4.1"

lua54 "yes"

game "gta5"

ui_page "resources/build/index.html"

shared_script "Settings.lua"

client_script "client.lua"

server_script "server.lua"


files {
  "resources/build/index.html",
  "resources/build/**/*"
}

escrow_ignore { "Settings.lua",
}
dependency '/assetpacks'