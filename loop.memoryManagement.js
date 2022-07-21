var funcBuildOrders = require('func.buildOrders');
var loopMemoryManagement =
{
	start: function(currentRoom)
	{
		if((_.filter(Memory.rooms, (room) => room.name == currentRoom)).length > 0)
		{
			var thisRoom = Game.rooms[currentRoom]
			var myRoom = Memory.rooms.find(element => element.name == currentRoom);
			let buildList = thisRoom.find(FIND_CONSTRUCTION_SITES)
			switch(myRoom.phase)
			{
				case 0://we have room info and locations, build road to Source from Spawn
				{
					if(buildList.length < 1)
					{
						funcBuildOrders.buildCenterToSpawn(thisRoom.name)
						myRoom.phase = 1
						console.log(currentRoom,"Ready For Stage 1")
					}
					else
					{
						console.log(currentRoom,"Not Ready For Stage 1")
					}
					break;
				}
				case 1://we have road to Source from Spawn, create road from Source to Controller
				{
					if(buildList.length < 1)
					{
						funcBuildOrders.buildCenterToController(thisRoom.name)
						myRoom.phase = 2
						console.log(currentRoom,"Ready For Stage 2")
					}
					break;
				}
				case 2://we have road to controller from sources
				{
					if(buildList.length < 1)
					{
						funcBuildOrders.buildCenterToSource(thisRoom.name)
						myRoom.phase = 3
						console.log(currentRoom,"Ready For Stage 3")
					}
					break;
				}
				case 3://Build Storage in city center
				{
					if(buildList.length < 1)
					{
						var myRoom = Memory.rooms.find(element => element.name == thisRoom.name);
						let storageId = funcBuildOrders.buildSourceStorage(thisRoom.name)
						myRoom.spawnContainer = storageId
						myRoom.phase = 4
						console.log(currentRoom,"Ready For Stage 4")
					}
					break;
				}
				case 4://Build containers for harvestors
				{
					if(buildList.length < 1)
					{
						//myRoom.phase = 5
						console.log(currentRoom,"Ready For Stage 4")		
					}
					break;
				}
				case 5://Build Upgrager Container
				{
					let containerId = funcBuildOrders.buildUpgraderContainer(thisRoom.name)
					if(containerId != 'Single Sources Unhandled')
					{
						var myRoom = Memory.rooms.find(element => element.name == thisRoom.name);
						myRoom.controllerContainer = containerId
						myRoom.phase = 6
						console.log(currentRoom,"Ready For Stage 6")
					}
					break;
				}
				case 6://Build Spawn Container
				{
					let containerId = funcBuildOrders.buildSpawnContainer(thisRoom.name)
					var myRoom = Memory.rooms.find(element => element.name == thisRoom.name);
					myRoom.spawnContainer = containerId
					myRoom.phase = 7
					console.log(currentRoom,"Ready For Stage 7")
					break;
				}
				case 7:
				{
					if(buildList.length < 1)
					{
						funcBuildOrders.buildExtensions(thisRoom.name)
						console.log(currentRoom,"Ready For Stage 7")		
					}
					else
					{
						console.log(currentRoom,"Not Ready For Stage 7")
					}
					break;
				}
				case 8:
				case 9:
				case 10:
				{
					break;
				}
			}
			
		}
		

	},
	
	add: function(currentRoom)
	{
		console.log(currentRoom)
		let room = Game.rooms[currentRoom]
		if(Memory.rooms == null)
		{
			Memory.rooms = []
		}
		let memRooms = Memory.rooms
		var newRoom = {}
		newRoom.name = currentRoom
		newRoom.jobs = []
		//Get CenterPoint of Room for CitySquare
		var xSum = 0;
		var xCount = 0;
		var ySum = 0;
		var yCount = 0;
		//Find Spawns and Put it in
		newRoom.spawns = []
		var newSpawn = {}
		newSpawn.id = Game.spawns[currentRoom].id
		newSpawn.pos = Game.spawns[currentRoom].pos
		newRoom.spawns.push(newSpawn)
		xSum += Game.spawns[currentRoom].pos.x
		xCount++
		ySum += Game.spawns[currentRoom].pos.y
		yCount++
		//Find Controller and Put it in
		newRoom.controller = {}
		newRoom.controller.id = room.controller.id
		newRoom.controller.pos = room.controller.pos
		//Get CenterPoint of Room for CitySquare
		xSum = newRoom.controller.pos.x;
		xCount++;
		ySum = newRoom.controller.pos.y;
		yCount++;
		//Find Sources and Put them in
		let roomSources = _.map(room.find(FIND_SOURCES), function(source){return {id: source.id, pos: source.pos};});
		newRoom.sources = []
		for(var roomSource in roomSources)
		{
			var newSource = {}
			console.log(roomSource)
			newSource.id = roomSources[roomSource].id
			newSource.pos = roomSources[roomSource].pos
			newRoom.sources.push(newSource)
			xSum += roomSources[roomSource].pos.x
			xCount++
			ySum += roomSources[roomSource].pos.y
			yCount++
		}

		newRoom.cityCenter = {}
		newRoom.cityCenter.pos = {}
		newRoom.cityCenter.pos.x = Math.round(xSum / xCount)
		newRoom.cityCenter.pos.y = Math.round(ySum / yCount)
		newRoom.cityCenter.pos.roomName = currentRoom
		newRoom.config = {}
		newRoom.config.minWallHits = 2500
		newRoom.config.minRampartHits = 2500
		newRoom.phase = 0
		memRooms.push(newRoom)
		console.log("Ready For Stage 1")      
		
	}

};

module.exports = loopMemoryManagement;
