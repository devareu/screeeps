var functions =
{
	//require('functions').stopBuilds()
    stopBuilds: function()
    {
		var intCounter = 0
      for(sites in Game.constructionSites)
      {
		  intCounter++
        Game.getObjectById(sites).remove()
      }
	  return intCounter
    },

	addRoomToAllCreeps: function()
	{
		for(var name in Memory.creeps)
		{
		  Game.creeps[name].memory.room = 'W8N3'
		}
	},

    killStruct: function(filter)
    {
      var structures = []
      for(thisRoom in Memory.rooms)
      {
        let thisRoom = Game.rooms[Memory.rooms[0].name]
        var roomStructures = thisRoom.find(FIND_STRUCTURES);
        structures = structures.concat(roomStructures)
      }
      console.log('Total Structures:' + structures.length)
      switch(filter)
      {
  				case 'roads':
          {
            let roads = _.filter(structures, (strct) => strct.structureType == STRUCTURE_ROAD)
            for(road in roads)
            {
              roads[road].destroy()
            }
            console.log('Roads Destroyed:'+roads.length)
            return true
  				  break;
          }
          default:
          {
            break;
          }
      }
    }
};
module.exports = functions;
