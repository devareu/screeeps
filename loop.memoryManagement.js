var funcBuildOrders = require('func.buildOrders');
var funcHelpers = require('func.helpers');
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
				case 0:
				{//Road From CityCenter to Spawn, Source, and Controller
					
					if(buildList.length < 1)
					{
						funcBuildOrders.buildCenterToSpawn(currentRoom)
						funcBuildOrders.buildCenterToController(currentRoom)
						funcBuildOrders.buildCenterToSource(currentRoom)
						//funcBuildOrders.buildSpawnStorage(currentRoom)
						//Get the containers for the sources and controller
						
						if(myRoom.controller.store && myRoom.sources[0].store && myRoom.spawnContainer &&
							(
								myRoom.sources[1].store
								||
								!myRoom.sources[1]
							))
						{
							console.log(currentRoom,"Advancing to Phase", myRoom.phase+1)
							myRoom.phase = 1							
						}
						else
						{
							if(!myRoom.controller.store)
							{//Missing Controller Store, find it
								let foundStructures = thisRoom.lookForAtArea(LOOK_STRUCTURES
									,myRoom.controller.pos.y-3
									,myRoom.controller.pos.x-3
									,myRoom.controller.pos.y+3
									,myRoom.controller.pos.x+3
									,true
									)
									console.log(JSON.stringify(foundStructures))
								if(foundStructures.length > 1)
								{
									let foundContainer = foundStructures.find(element => element.structure.structureType == STRUCTURE_CONTAINER);
									if(foundContainer)
									{
										myRoom.controller.store = foundContainer.structure.id
									}
								}
								else
								{
									myRoom.controller.store = foundStructures.id
								}
							}
							if(!myRoom.sources[0].store)
							{
								let foundStructures = thisRoom.lookForAtArea(LOOK_STRUCTURES
									,myRoom.sources[0].pos.y-1
									,myRoom.sources[0].pos.x-1
									,myRoom.sources[0].pos.y+1
									,myRoom.sources[0].pos.x+1
									,true
									)
								console.log(JSON.stringify(foundStructures))
								if(foundStructures.length > 0)
								{
									let foundContainer = foundStructures.find(element => element.structure.structureType == STRUCTURE_CONTAINER);
									
									myRoom.sources[0].store = foundContainer.structure.id
								}
								else
								{
									myRoom.sources[0].store = foundContainer.id
								}
							}
							if(myRoom.sources[1] &&!myRoom.sources[1].store)
							{
								let foundStructures = thisRoom.lookForAtArea(LOOK_STRUCTURES
									,myRoom.sources[1].pos.y-1
									,myRoom.sources[1].pos.x-1
									,myRoom.sources[1].pos.y+1
									,myRoom.sources[1].pos.x+1
									,true
									)
								if(foundStructures.length > 0)
								{
									let foundContainer = foundStructures.find(element => element.structure.structureType == STRUCTURE_CONTAINER);
									myRoom.sources[1].store = foundContainer.structure.id
								}
								else
								{
									myRoom.sources[1].store = foundStructures.id
								}
							}
							if(!myRoom.spawnContainer)
							{
								if(thisRoom.controller.level > 3)
								{
									let thisStore = thisRoom.find(FIND_MY_STRUCTURES).find(element => element.structureType == STRUCTURE_STORAGE);
									if(thisStore)
									{
										myRoom.spawnContainer = thisStore.id
									}
								}
								else
								{
									let foundStructures = thisRoom.lookForAtArea(LOOK_STRUCTURES
										,myRoom.spawns[0].pos.y-3
										,myRoom.spawns[0].pos.x-3
										,myRoom.spawns[0].pos.y+3
										,myRoom.spawns[0].pos.x+3
										,true
										)
									if(foundStructures.length > 0)
									{
										let foundContainer = foundStructures.find(element => element.structure.structureType == STRUCTURE_CONTAINER);
										myRoom.spawnContainer = foundContainer.structure.id
									}
									else
									{
										console.log('No Structure Found Near Spawn')
									}
								}
							}
						}
						
					}
					else
					{
						console.log(currentRoom,"Not Ready For Advancement, Building")				
					}
					break;
				}
				case 1:
				{//Extensions first Round
					if(buildList.length < 1)
					{
						funcBuildOrders.buildExtensions(thisRoom.name)
						myRoom.phase = myRoom.phase+1
						console.log(currentRoom,"Advancing to Phase", myRoom.phase+1)
					}
					else
					{						
						console.log(currentRoom,"Not Ready For Advancement, Building")
					}
				}
				case 2:
				{//Build Spawn and Source Links
					if(buildList.length < 1 && thisRoom.controller.level >= 6)
					{
						if(!myRoom.spawns[0].link)
						{
							let foundStructures = thisRoom.lookForAtArea(LOOK_STRUCTURES
								,myRoom.spawns[0].pos.y-3
								,myRoom.spawns[0].pos.x-3
								,myRoom.spawns[0].pos.y+3
								,myRoom.spawns[0].pos.x+3
								,true
								)
							let foundLink = foundStructures.find(element => element.structure.structureType == STRUCTURE_LINK);
							if(foundLink)
							{	
								myRoom.spawns[0].link = foundLink.structure.id
							}
						}
						if(!myRoom.sources[0].link)
						{
							let foundStructures = thisRoom.lookForAtArea(LOOK_STRUCTURES
								,myRoom.sources[0].pos.y-2
								,myRoom.sources[0].pos.x-2
								,myRoom.sources[0].pos.y+2
								,myRoom.sources[0].pos.x+2
								,true
								)
							if(foundStructures.length > 0)
							{
								let foundLink = foundStructures.find(element => element.structure.structureType == STRUCTURE_LINK);								
								if(foundLink)
								{	
									myRoom.sources[0].link = foundLink.structure.id
								}
							}
							else
							{
								console.log('No Structure Found Near Spawn')
							}
						}
						if(!myRoom.sources[1].link)
						{
							let foundStructures = thisRoom.lookForAtArea(LOOK_STRUCTURES
								,myRoom.sources[1].pos.y-2
								,myRoom.sources[1].pos.x-2
								,myRoom.sources[1].pos.y+2
								,myRoom.sources[1].pos.x+2
								,true
								)
							if(foundStructures.length > 0)
							{
								let foundLink = foundStructures.find(element => element.structure.structureType == STRUCTURE_LINK);
								myRoom.sources[1].link = foundLink.structure.id
							}
							else
							{
								console.log('No Structure Found Near Spawn')
							}
						}
						if(myRoom.spawns[0].link && myRoom.sources[0].link && (!myRoom.sources[1] || myRoom.sources[1].link))
						{
							console.log(currentRoom,"Advancing to Phase", myRoom.phase + 1)
							myRoom.phase = myRoom.phase + 1
						}
						else
						{
							console.log(myRoom.name)
							funcBuildOrders.buildLinks(thisRoom.name)
						}
					}
					else
					{
						console.log(currentRoom,"Not Ready For Advancement, Building or Under Level")
					}
					break;
				}
				case 3:
				{//Build Spawn Storage if it doesnt exist
					if(buildList.length < 1)
					{
						if(myRoom.spawnContainer)
						{
							myRoom.phase = myRoom.phase+1
							console.log(currentRoom,"Advancing to Phase", myRoom.phase+1)
						}
						else
						{
							funcBuildOrders.buildSpawnStorage(thisRoom.name)							
						}
					}
					else
					{
						console.log(currentRoom,"Not Ready For Advancement, Building")
					}
					break;
				}
				case 4:
				{//Build / Find Terminal				
					if(buildList.length < 1)
					{
						if(!myRoom.terminal)
						{
							let thisTerminal = thisRoom.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TERMINAL } } )
								console.log(JSON.stringify(thisTerminal))
							if(thisTerminal)
							{
								myRoom.terminal = thisTerminal.id
								console.log(currentRoom,"Advancing to Phase", myRoom.phase+1)
								myRoom.phase = myRoom.phase+1
								break
							}
							else
							{
								console.log(currentRoom,"Not Ready For Advancement, missing Terminal")
								break
							}
						}
					}
					else
					{
						console.log(currentRoom,"Not Ready For Advancement, missing Building")
						break
					}
				}					
							
				case 5:
				case 6:
				case 7:
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
			newSource.harvestersMax = funcHelpers.findSourceLimit(roomSources[roomSource].pos)
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
