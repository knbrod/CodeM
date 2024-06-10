fx_version 'cerulean'
game 'gta5'
lua54 'yes'
version '1.2'

description 'CODEM SPAWN SELECTOR'

shared_scripts {
	'config.lua'
}

server_scripts {
	'config_server.lua',
	'server/sv_*.lua'
}

client_scripts {
	'client/cl_*.lua',
}

ui_page 'html/index.html'

files {
	'html/assets/fonts/*.woff',
	'html/assets/fonts/*.woff2',
	'html/assets/fonts/*.css',
	'html/assets/*.png',
	'html/assets/*.svg',
	'html/assets/*.jpg',
	'html/css/*.css',
	'html/js/*.js',
	'html/js/**/*.js',
	'html/pages/**',
	'html/index.html',
}

escrow_ignore{
	'config_server.lua',
	'config.lua',
	'client/cl_framework.lua',
	'server/sv_framework.lua',
}
dependency '/assetpacks'