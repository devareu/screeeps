var loopCore = require('loop.core');
var loopMemoryManagement = require('loop.memoryManagement')
var baseRoom = 'W8N3'

module.exports.loop = function ()
{
    if(Memory.rooms.length == null || Memory.rooms.length == 0)
    {
        loopMemoryManagement.add(baseRoom)
    }
	
	for(room in Memory.rooms)
	{
		loopCore.creepManagement(Memory.rooms[room].name)
		loopCore.towerManagement(Memory.rooms[room].name)
		loopCore.linkManagement(Memory.rooms[room].name)
		if(Game.time % 50 == 0)
		{
			loopMemoryManagement.start(Memory.rooms[room].name)
		}
	}
	
	if(Game.gcl.level >= 2 && Game.time % 10 == 0)
	{		
		let expFlags = _.filter(Game.flags,(flag) => flag.name == 'expand');
		if(expFlags.length == 1)
		{
			let expFlag = expFlags[0]
			let newRoom = expFlag.pos.roomName
			loopCore.expansionManagement(newRoom)
		}
	}
}
