var loopCore = require('loop.core');
var loopMemoryManagement = require('loop.memoryManagement')
var baseRoom = 'W8N3'

module.exports.loop = function ()
{
	for(room in Memory.rooms)
	{
		loopCore.creepManagement(Memory.rooms[room].name)
		if(Game.time % 50 == 0)
		{
			console.log('Mgmt of Room: ' + Memory.rooms[room].name)
			loopMemoryManagement.start(Memory.rooms[room].name)
		}
	}
	if(Game.gcl.level >= 2 && Game.time % 250 == 0)
	{		
		console.log('Time To Hunt!')
	}
}
