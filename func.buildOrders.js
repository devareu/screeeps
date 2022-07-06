var funcHelpers = require('func.helpers');
var funcBuildOrders =
{
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
		var goal = { pos: myRoom.controller.pos, range: 1}
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
			if(thisRoomTerrain.get(ret.path[pathPoint].x,ret.path[pathPoint].y-1) != TERRAIN_MASK_WALL)
			{
				room.createConstructionSite(ret.path[pathPoint].x,ret.path[pathPoint].y-1, STRUCTURE_ROAD);
			}
			if(thisRoomTerrain.get(ret.path[pathPoint].x,ret.path[pathPoint].y+1) != TERRAIN_MASK_WALL)
			{
				room.createConstructionSite(ret.path[pathPoint].x,ret.path[pathPoint].y+1, STRUCTURE_ROAD);
			}
			if(thisRoomTerrain.get(ret.path[pathPoint].x-1,ret.path[pathPoint].y-1) != TERRAIN_MASK_WALL)
			{
				room.createConstructionSite(ret.path[pathPoint].x-1,ret.path[pathPoint].y-1, STRUCTURE_ROAD);
			}
			if(thisRoomTerrain.get(ret.path[pathPoint].x-1,ret.path[pathPoint].y) != TERRAIN_MASK_WALL)
			{
				room.createConstructionSite(ret.path[pathPoint].x-1,ret.path[pathPoint].y, STRUCTURE_ROAD);
			}
			if(thisRoomTerrain.get(ret.path[pathPoint].x-1,ret.path[pathPoint].y+1) != TERRAIN_MASK_WALL)
			{
				room.createConstructionSite(ret.path[pathPoint].x-1,ret.path[pathPoint].y+1, STRUCTURE_ROAD);
			}
			if(thisRoomTerrain.get(ret.path[pathPoint].x+1,ret.path[pathPoint].y-1) != TERRAIN_MASK_WALL)
			{
				room.createConstructionSite(ret.path[pathPoint].x+1,ret.path[pathPoint].y-1, STRUCTURE_ROAD);
			}
			if(thisRoomTerrain.get(ret.path[pathPoint].x+1,ret.path[pathPoint].y) != TERRAIN_MASK_WALL)
			{
				room.createConstructionSite(ret.path[pathPoint].x+1,ret.path[pathPoint].y, STRUCTURE_ROAD);
			}
			if(thisRoomTerrain.get(ret.path[pathPoint].x+1,ret.path[pathPoint].y+1) != TERRAIN_MASK_WALL)
			{
				room.createConstructionSite(ret.path[pathPoint].x+1,ret.path[pathPoint].y+1, STRUCTURE_ROAD);
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
				if(thisRoomTerrain.get(ret.path[pathPoint].x,ret.path[pathPoint].y-1) != TERRAIN_MASK_WALL)
				{
					room.createConstructionSite(ret.path[pathPoint].x,ret.path[pathPoint].y-1, STRUCTURE_ROAD);
				}
				if(thisRoomTerrain.get(ret.path[pathPoint].x,ret.path[pathPoint].y+1) != TERRAIN_MASK_WALL)
				{
					room.createConstructionSite(ret.path[pathPoint].x,ret.path[pathPoint].y+1, STRUCTURE_ROAD);
				}
				if(thisRoomTerrain.get(ret.path[pathPoint].x-1,ret.path[pathPoint].y-1) != TERRAIN_MASK_WALL)
				{
					room.createConstructionSite(ret.path[pathPoint].x-1,ret.path[pathPoint].y-1, STRUCTURE_ROAD);
				}
				if(thisRoomTerrain.get(ret.path[pathPoint].x-1,ret.path[pathPoint].y) != TERRAIN_MASK_WALL)
				{
					room.createConstructionSite(ret.path[pathPoint].x-1,ret.path[pathPoint].y, STRUCTURE_ROAD);
				}
				if(thisRoomTerrain.get(ret.path[pathPoint].x-1,ret.path[pathPoint].y+1) != TERRAIN_MASK_WALL)
				{
					room.createConstructionSite(ret.path[pathPoint].x-1,ret.path[pathPoint].y+1, STRUCTURE_ROAD);
				}
				if(thisRoomTerrain.get(ret.path[pathPoint].x+1,ret.path[pathPoint].y-1) != TERRAIN_MASK_WALL)
				{
					room.createConstructionSite(ret.path[pathPoint].x+1,ret.path[pathPoint].y-1, STRUCTURE_ROAD);
				}
				if(thisRoomTerrain.get(ret.path[pathPoint].x+1,ret.path[pathPoint].y) != TERRAIN_MASK_WALL)
				{
					room.createConstructionSite(ret.path[pathPoint].x+1,ret.path[pathPoint].y, STRUCTURE_ROAD);
				}
				if(thisRoomTerrain.get(ret.path[pathPoint].x+1,ret.path[pathPoint].y+1) != TERRAIN_MASK_WALL)
				{
					room.createConstructionSite(ret.path[pathPoint].x+1,ret.path[pathPoint].y+1, STRUCTURE_ROAD);
				}
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
				if(thisRoomTerrain.get(ret.path[pathPoint].x,ret.path[pathPoint].y-1) != TERRAIN_MASK_WALL)
				{
					room.createConstructionSite(ret.path[pathPoint].x,ret.path[pathPoint].y-1, STRUCTURE_ROAD);
				}
				if(thisRoomTerrain.get(ret.path[pathPoint].x,ret.path[pathPoint].y+1) != TERRAIN_MASK_WALL)
				{
					room.createConstructionSite(ret.path[pathPoint].x,ret.path[pathPoint].y+1, STRUCTURE_ROAD);
				}
				if(thisRoomTerrain.get(ret.path[pathPoint].x-1,ret.path[pathPoint].y-1) != TERRAIN_MASK_WALL)
				{
					room.createConstructionSite(ret.path[pathPoint].x-1,ret.path[pathPoint].y-1, STRUCTURE_ROAD);
				}
				if(thisRoomTerrain.get(ret.path[pathPoint].x-1,ret.path[pathPoint].y) != TERRAIN_MASK_WALL)
				{
					room.createConstructionSite(ret.path[pathPoint].x-1,ret.path[pathPoint].y, STRUCTURE_ROAD);
				}
				if(thisRoomTerrain.get(ret.path[pathPoint].x-1,ret.path[pathPoint].y+1) != TERRAIN_MASK_WALL)
				{
					room.createConstructionSite(ret.path[pathPoint].x-1,ret.path[pathPoint].y+1, STRUCTURE_ROAD);
				}
				if(thisRoomTerrain.get(ret.path[pathPoint].x+1,ret.path[pathPoint].y-1) != TERRAIN_MASK_WALL)
				{
					room.createConstructionSite(ret.path[pathPoint].x+1,ret.path[pathPoint].y-1, STRUCTURE_ROAD);
				}
				if(thisRoomTerrain.get(ret.path[pathPoint].x+1,ret.path[pathPoint].y) != TERRAIN_MASK_WALL)
				{
					room.createConstructionSite(ret.path[pathPoint].x+1,ret.path[pathPoint].y, STRUCTURE_ROAD);
				}
				if(thisRoomTerrain.get(ret.path[pathPoint].x+1,ret.path[pathPoint].y+1) != TERRAIN_MASK_WALL)
				{
					room.createConstructionSite(ret.path[pathPoint].x+1,ret.path[pathPoint].y+1, STRUCTURE_ROAD);
				}
			}
		}

		return 'completed'
	},
	
	buildSourceStorage: function(roomName)
	{
		var myRoom = Memory.rooms.find(element => element.name == roomName);
		var room = Game.rooms[roomName]
		const thisRoomTerrain = Game.map.getRoomTerrain(roomName);
		
		if (myRoom.sources.lengh > 1)
		{
			var newPoint = findPointInLine(myRoom.name, myRoom.sources[0].pos, myRoom.sources[1].pos,"50%")
		}
		
		room.createConstructionSite(posX,posY, STRUCTURE_STORAGE)
		let found = room.lookForAt(LOOK_CONSTRUCTION_SITES,posX,posY)
		return found.id
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
	
	buildSpawnContainer: function(roomName)
	{
		var myRoom = Memory.rooms.find(element => element.name == roomName);
		var room = Game.rooms[roomName]

		var newPoint = funcHelpers.findPointInLine(myRoom.name, myRoom.spawns[0].pos, myRoom.cityCenter.pos, "2away")
		room.createConstructionSite(newPoint.x,newPoint.y, STRUCTURE_CONTAINER)
		let found = room.lookForAt(LOOK_CONSTRUCTION_SITES,newPoint.x,newPoint.y)
		return found[0].id
	},
	
	buildExtensions: function(roomName)
	{
		var myRoom = Memory.rooms.find(element => element.name == roomName);
		var room = Game.rooms[roomName]
		
		var keepTryin = true
		
		let core = myRoom.spawns[0].pos
		var loopLevel = 2
		
		while (keepTryin == true && loopLevel <= 8)
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
					if(foundTerrain.terrain == 'plain')
					{
						if(foundItems.filter(element => element.type == 'structure' && element.structure.structureType != 'road').length < 1)
						{
							let result = room.createConstructionSite(thisPointX,thisPointY, STRUCTURE_EXTENSION)
							if(result == 0)
							{
								funcBuildOrders.buildRoadSurround({x:thisPointX, y:thisPointY, roomName:room.name})
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
			loopLevel = loopLevel + 2
		}
	}

};
module.exports = funcBuildOrders;
