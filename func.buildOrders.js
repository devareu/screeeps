var funcHelpers = require('func.helpers');
var funcBuildOrders =
{//require('func.buildOrders').buildWalls('W8N3')
	buildRoadSurround: function(pos)
	{
		var room = Game.rooms[pos.roomName]
		const thisRoomTerrain = Game.map.getRoomTerrain(pos.roomName)
		if(thisRoomTerrain.get(pos.x,pos.y) != TERRAIN_MASK_WALL)
		{
			room.createConstructionSite(pos.x,pos.y, STRUCTURE_ROAD);
		}
		if(thisRoomTerrain.get(pos.x,pos.y-1) != TERRAIN_MASK_WALL)
		{
			room.createConstructionSite(pos.x,pos.y-1, STRUCTURE_ROAD);
		}
		if(thisRoomTerrain.get(pos.x,pos.y+1) != TERRAIN_MASK_WALL)
		{
			room.createConstructionSite(pos.x,pos.y+1, STRUCTURE_ROAD);
		}
		if(thisRoomTerrain.get(pos.x-1,pos.y-1) != TERRAIN_MASK_WALL)
		{
			room.createConstructionSite(pos.x-1,pos.y-1, STRUCTURE_ROAD);
		}
		if(thisRoomTerrain.get(pos.x-1,pos.y) != TERRAIN_MASK_WALL)
		{
			room.createConstructionSite(pos.x-1,pos.y, STRUCTURE_ROAD);
		}
		if(thisRoomTerrain.get(pos.x-1,pos.y+1) != TERRAIN_MASK_WALL)
		{
			room.createConstructionSite(pos.x-1,pos.y+1, STRUCTURE_ROAD);
		}
		if(thisRoomTerrain.get(pos.x+1,pos.y-1) != TERRAIN_MASK_WALL)
		{
			room.createConstructionSite(pos.x+1,pos.y-1, STRUCTURE_ROAD);
		}
		if(thisRoomTerrain.get(pos.x+1,pos.y) != TERRAIN_MASK_WALL)
		{
			room.createConstructionSite(pos.x+1,pos.y, STRUCTURE_ROAD);
		}
		if(thisRoomTerrain.get(pos.x+1,pos.y+1) != TERRAIN_MASK_WALL)
		{
			room.createConstructionSite(pos.x+1,pos.y+1, STRUCTURE_ROAD);
		}
	},
	
	buildCenter: function(roomName)
	{
		var myRoom = Memory.rooms.find(element => element.name == roomName);
		var room = Game.rooms[roomName]
		const thisRoomTerrain = Game.map.getRoomTerrain(roomName)
		if(thisRoomTerrain.get(myRoom.cityCenter.pos.x,myRoom.cityCenter.pos.y) != TERRAIN_MASK_WALL)
		{
			room.createConstructionSite(myRoom.cityCenter.pos.x,myRoom.cityCenter.pos.y, STRUCTURE_ROAD);
		}
		if(thisRoomTerrain.get(myRoom.cityCenter.pos.x,myRoom.cityCenter.pos.y-1) != TERRAIN_MASK_WALL)
		{
			room.createConstructionSite(myRoom.cityCenter.pos.x,myRoom.cityCenter.pos.y-1, STRUCTURE_ROAD);
		}
		if(thisRoomTerrain.get(myRoom.cityCenter.pos.x,myRoom.cityCenter.pos.y+1) != TERRAIN_MASK_WALL)
		{
			room.createConstructionSite(myRoom.cityCenter.pos.x,myRoom.cityCenter.pos.y+1, STRUCTURE_ROAD);
		}
		if(thisRoomTerrain.get(myRoom.cityCenter.pos.x-1,myRoom.cityCenter.pos.y-1) != TERRAIN_MASK_WALL)
		{
			room.createConstructionSite(myRoom.cityCenter.pos.x-1,myRoom.cityCenter.pos.y-1, STRUCTURE_ROAD);
		}
		if(thisRoomTerrain.get(myRoom.cityCenter.pos.x-1,myRoom.cityCenter.pos.y) != TERRAIN_MASK_WALL)
		{
			room.createConstructionSite(myRoom.cityCenter.pos.x-1,myRoom.cityCenter.pos.y, STRUCTURE_ROAD);
		}
		if(thisRoomTerrain.get(myRoom.cityCenter.pos.x-1,myRoom.cityCenter.pos.y+1) != TERRAIN_MASK_WALL)
		{
			room.createConstructionSite(myRoom.cityCenter.pos.x-1,myRoom.cityCenter.pos.y+1, STRUCTURE_ROAD);
		}
		if(thisRoomTerrain.get(myRoom.cityCenter.pos.x+1,myRoom.cityCenter.pos.y-1) != TERRAIN_MASK_WALL)
		{
			room.createConstructionSite(myRoom.cityCenter.pos.x+1,myRoom.cityCenter.pos.y-1, STRUCTURE_ROAD);
		}
		if(thisRoomTerrain.get(myRoom.cityCenter.pos.x+1,myRoom.cityCenter.pos.y) != TERRAIN_MASK_WALL)
		{
			room.createConstructionSite(myRoom.cityCenter.pos.x+1,myRoom.cityCenter.pos.y, STRUCTURE_ROAD);
		}
		if(thisRoomTerrain.get(myRoom.cityCenter.pos.x+1,myRoom.cityCenter.pos.y+1) != TERRAIN_MASK_WALL)
		{
			room.createConstructionSite(myRoom.cityCenter.pos.x+1,myRoom.cityCenter.pos.y+1, STRUCTURE_ROAD);
		}
	},
	
	buildCenterToController: function(roomName)
	{
		var myRoom = Memory.rooms.find(element => element.name == roomName);
		var room = Game.rooms[roomName]
		var goal = { pos: myRoom.controller.pos, range: 3}
		const thisRoomTerrain = Game.map.getRoomTerrain(roomName)
		var ret = PathFinder.search(myRoom.cityCenter.pos, goal,
		{
			plainCost: 5,
			swampCost: 5,
			roomCallback: function(roomName)
			{
				if (!room) return;
				let costs = new PathFinder.CostMatrix;
				room.find(FIND_STRUCTURES).forEach(function(struct)
				{
					if (struct.structureType === STRUCTURE_ROAD)
					{
						costs.set(struct.pos.x, struct.pos.y, 1);
					}
					else if (struct.structureType !== STRUCTURE_CONTAINER && (struct.structureType !== STRUCTURE_RAMPART || !struct.my))
					{
						costs.set(struct.pos.x, struct.pos.y, 0xff);
					}
				});
				return costs;
			},
		});
		for(var pathPoint in ret.path)
		{
			room.createConstructionSite(ret.path[pathPoint].x,ret.path[pathPoint].y, STRUCTURE_ROAD);
			if(pathPoint == ret.path.length - 1)
			{
				room.createConstructionSite(ret.path[pathPoint].x,ret.path[pathPoint].y, STRUCTURE_CONTAINER)
			}
		}
		return 'completed'
	},
	
	buildCenterToSpawn: function(roomName)
	{
		var myRoom = Memory.rooms.find(element => element.name == roomName);
		var room = Game.rooms[roomName]
		const thisRoomTerrain = Game.map.getRoomTerrain(roomName);
		for(spawn in myRoom.spawns)
		{
			var goal = { pos: myRoom.spawns[spawn].pos, range: 0}
			var ret = PathFinder.search(myRoom.cityCenter.pos, goal,
			{
				plainCost: 5,
				swampCost: 5,
				roomCallback: function(roomName)
				{
					if (!room) return;
					let costs = new PathFinder.CostMatrix;
					room.find(FIND_STRUCTURES).forEach(function(struct)
					{
						if (struct.structureType === STRUCTURE_ROAD)
						{
							costs.set(struct.pos.x, struct.pos.y, 1);
						}
						else if (struct.structureType !== STRUCTURE_CONTAINER && (struct.structureType !== STRUCTURE_RAMPART || !struct.my))
						{
							costs.set(struct.pos.x, struct.pos.y, 0xff);
						}
					});
					return costs;
				},
			});
			for(var pathPoint in ret.path)
			{
				room.createConstructionSite(ret.path[pathPoint].x,ret.path[pathPoint].y, STRUCTURE_ROAD);
			}
		}

		return 'completed'
	},
	
	buildCenterToSource: function(roomName)
	{
		var myRoom = Memory.rooms.find(element => element.name == roomName);
		var room = Game.rooms[roomName]
		const thisRoomTerrain = Game.map.getRoomTerrain(roomName);
		for(source in myRoom.sources)
		{
			var goal = { pos: myRoom.sources[source].pos, range: 0}
			var ret = PathFinder.search(myRoom.cityCenter.pos, goal,
			{
				plainCost: 5,
				swampCost: 5,
				roomCallback: function(roomName)
				{
					if (!room) return;
					let costs = new PathFinder.CostMatrix;
					room.find(FIND_STRUCTURES).forEach(function(struct)
					{
						if (struct.structureType === STRUCTURE_ROAD)
						{
							costs.set(struct.pos.x, struct.pos.y, 1);
						}
						else if (struct.structureType !== STRUCTURE_CONTAINER && (struct.structureType !== STRUCTURE_RAMPART || !struct.my))
						{
							costs.set(struct.pos.x, struct.pos.y, 0xff);
						}
					});
					return costs;
				},
			});
			for(var pathPoint in ret.path)
			{
				room.createConstructionSite(ret.path[pathPoint].x,ret.path[pathPoint].y, STRUCTURE_ROAD);
				if(pathPoint == ret.path.length - 1)
				{
					room.createConstructionSite(ret.path[pathPoint].x,ret.path[pathPoint].y, STRUCTURE_CONTAINER)
				}
			}
		}

		return 'completed'
	},
	
	buildSpawnStorage: function(roomName)
	{
		var myRoom = Memory.rooms.find(element => element.name == roomName);
		var room = Game.rooms[roomName]

		const thisRoomTerrain = Game.map.getRoomTerrain(roomName);
		var newPoint = funcHelpers.findPointInLine(myRoom.name, myRoom.spawns[0].pos, myRoom.cityCenter.pos,"3away")
		console.log(JSON.stringify(myRoom.spawns[0].pos),JSON.stringify(myRoom.cityCenter.pos))
		if(room.controller.level > 3)
		{
			room.createConstructionSite(newPoint.x,newPoint.y, STRUCTURE_STORAGE)
		}
		else
		{
			room.createConstructionSite(newPoint.x,newPoint.y, STRUCTURE_CONTAINER)
		}			
	},
	
	buildUpgraderContainer: function(roomName)
	{
		var myRoom = Memory.rooms.find(element => element.name == roomName);
		var room = Game.rooms[roomName]
		
		if (myRoom.sources.length > 1)
		{
			var newPoint = funcHelpers.findPointInLine(myRoom.name, myRoom.controller.pos, myRoom.cityCenter.pos, 4)
			room.createConstructionSite(newPoint.x,newPoint.y, STRUCTURE_CONTAINER)
			let found = room.lookForAt(LOOK_CONSTRUCTION_SITES,newPoint.x,newPoint.y)
			return found.id
		}
		else
		{
			return "Single Sources Unhandled"
			console.log('Single Sources Unhandled')
		}
	},
		
	buildLinks: function(roomName)
	{
		var myRoom = Memory.rooms.find(element => element.name == roomName);
		var room = Game.rooms[roomName]
		const thisRoomTerrain = Game.map.getRoomTerrain(roomName);
		for(source in myRoom.sources)
		{
			var goal = { pos: myRoom.sources[source].pos, range: 0}
			var ret = PathFinder.search(myRoom.cityCenter.pos, goal,
			{
				plainCost: 5,
				swampCost: 5,
				roomCallback: function(roomName)
				{
					if (!room) return;
					let costs = new PathFinder.CostMatrix;
					room.find(FIND_STRUCTURES).forEach(function(struct)
					{
						if (struct.structureType === STRUCTURE_ROAD)
						{
							costs.set(struct.pos.x, struct.pos.y, 1);
						}
						else if (struct.structureType !== STRUCTURE_CONTAINER && (struct.structureType !== STRUCTURE_RAMPART || !struct.my))
						{
							costs.set(struct.pos.x, struct.pos.y, 0xff);
						}
					});
					return costs;
				},
			});
			let pathNum = ret.path.length - 2
			let linkPoint = ret.path[pathNum]
			room.createConstructionSite(linkPoint.x,linkPoint.y, STRUCTURE_LINK)
		}
		
		let spawnLink = funcHelpers.findPointInLine(roomName,myRoom.spawns[0].pos, myRoom.cityCenter.pos, '2away')
		room.createConstructionSite(spawnLink.x,spawnLink.y, STRUCTURE_LINK)
		
		return 'completed'
	},
	
	buildExtensions: function(roomName)
	{
		var myRoom = Memory.rooms.find(element => element.name == roomName);
		var room = Game.rooms[roomName]
		
		var keepTryin = true
		
		let core = myRoom.spawns[0].pos
		var loopLevel = 1
		
		while (keepTryin == true && loopLevel <= 6)
		{
			//top left
			var thisPointX = core.x - loopLevel
			var thisPointY = core.y - loopLevel
			if(thisPointX < 0)
			{
				if(core.x % 2 == 0)
				{
					thisPointX = 0
				}
				else
				{
					thisPointX = 1
				}
			}
			if(thisPointY < 0)
			{
				if(core.y % 2 == 0)
				{
					thisPointY = 0
				}
				else
				{
					thisPointY = 1
				}
			}
			let maxX = core.x + loopLevel
			let maxY = core.y + loopLevel
			//console.log('Min:', thisPointX,thisPointY,'Max:', maxX,maxY)
			while(thisPointX <= maxX && keepTryin == true)
			{
				while (thisPointY <= maxY && keepTryin == true)
				{
					let foundItems = room.lookAt(thisPointX,thisPointY)
					let foundTerrain = foundItems.find(element => element.type == 'terrain');
					if(foundTerrain.terrain != 'wall')
					{
						if(foundItems.filter(element => element.type == 'structure' && element.structure.structureType != 'road').length < 1)
						{
							let result = room.createConstructionSite(thisPointX,thisPointY, STRUCTURE_EXTENSION)
							if(result == 0)
							{
								//funcBuildOrders.buildRoadSurround({x:thisPointX, y:thisPointY, roomName:room.name})
							}
							else
							{
								keepTryin = false
								break;
							}
						}
					}
					if(keepTryin == true)
					{
						thisPointY = thisPointY + 2
						if(thisPointY > 50)
						{
							if(core.y % 2 == 0)
							{
								thisPointY = 50
							}
							else
							{
								thisPointY = 49
							}
						}
					}
					else
					{
						break;
					}
				}
				if(keepTryin == true)
				{
					thisPointY = core.y - loopLevel
					if(thisPointY < 0)
					{
						if(core.y % 2 == 0)
						{
							thisPointY = 0
						}
						else
						{
							thisPointY = 1
						}
					}
					thisPointX = thisPointX + 2
					if(thisPointX > 50)
					{
						if(core.x % 2 == 0)
						{
							thisPointX = 50
						}
						else
						{
							thisPointX = 49
						}
					}

				}
				else
				{
					break;
				}
			}
			loopLevel = loopLevel + 1
		}
	},
	
	buildWalls: function(roomName)
	{
		var myRoom = Memory.rooms.find(element => element.name == roomName);
		var room = Game.rooms[roomName]
		
		let thisRoomsFlags = _.filter(Game.flags, (flag) => flag.pos.roomName == roomName);
		let intCounter = 1;
		var startFlag = {}
		var endFlag = {}
		do
		{
			startFlag = _.filter(thisRoomsFlags, (flag) => flag.name == 'Wall' + intCounter + 'start')[0];
			endFlag = _.filter(thisRoomsFlags, (flag) => flag.name == 'Wall' + intCounter + 'end')[0]
			intCounter++;
		}
		while (startFlag == null & endFlag == null & intCounter < 5);

		//filter(Game.creeps, (creep) => creep.memory.role == 'harvester' && creep.memory.room == roomName);
		var goal = { pos: endFlag.pos, range: 0}

		var ret = PathFinder.search(startFlag.pos, goal,
		{
			plainCost: 1,
			swampCost: 1,
			roomCallback: function(roomName)
			{
				if (!room) return;
				let costs = new PathFinder.CostMatrix;
				room.find(FIND_STRUCTURES).forEach(function(struct)
				{
					if (struct.structureType === STRUCTURE_ROAD)
					{
						costs.set(struct.pos.x, struct.pos.y, 1);
					}
					else if (struct.structureType !== STRUCTURE_CONTAINER && (struct.structureType !== STRUCTURE_RAMPART || !struct.my))
					{
						costs.set(struct.pos.x, struct.pos.y, 0xff);
					}
				});
				return costs;
			},
		});
		let wallLength = ret.path.length
		let centerPoint = Math.round(wallLength / 2)
		for(var pathPoint in ret.path)
		{
			if(pathPoint == centerPoint)
			{//This is the center of the wall, its a rampart
				room.createConstructionSite(ret.path[pathPoint].x,ret.path[pathPoint].y, STRUCTURE_RAMPART);
			}
			else
			{//This is not the center, its a wall
				room.createConstructionSite(ret.path[pathPoint].x,ret.path[pathPoint].y, STRUCTURE_WALL);
			}
		}
		let towerLocation =  funcHelpers.findPointInLine(roomName, ret.path[centerPoint], myRoom.cityCenter.pos, '1away')
		room.createConstructionSite(towerLocation.x,towerLocation.y, STRUCTURE_TOWER);
		room.createConstructionSite(endFlag.pos.x,endFlag.pos.y, STRUCTURE_WALL);
		startFlag.remove()
		endFlag.remove()
		return 'completed'
	}

};
module.exports = funcBuildOrders;
