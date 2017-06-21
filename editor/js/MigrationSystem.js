

function MigrationSystemClass(){
	
	this.migrations = new Array()	
	
	this.Add = function( format, migrationFunction ){
		
		this.migrations.push({
			"format":format,
			"migrationFunction":migrationFunction
		})
	}
	
	this.Migrate = function( obj ){
		var format = obj.format
		if ( !this.HasMigration(format) ){
			console.log("No migration for format '"+format+"'")
			return obj
		}
		var workingObj = obj
		
		var process = false
		var lastMigration;
		//Find the migration for this version,  then continue migrating from therein
		for( var s in this.migrations ){
			var migration = this.migrations[s]
			//~ console.log("Checking migration '" + migration.format + "'");
			if ( !process ){
				if ( migration.format == format ){
					process = true
				}
			} else {
				console.log("Migrating from '"+lastMigration.format+"' to '" + migration.format + "'")
				if ( migration.migrationFunction != null ){
					workingObj = migration.migrationFunction( workingObj )
				}
			
				workingObj.format = migration.format
			}
			lastMigration = migration
		}
		return workingObj
		
	}
	
	this.HasMigration = function(format ){
		for( var s in this.migrations ){
			var migration = this.migrations[s]
			if ( migration.format == format ){
				return true
			}
		}
		return false
	}
	
	
}

var MigrationSystem = new MigrationSystemClass()

MigrationSystem.Add("goose2017-01-31-1227")
MigrationSystem.Add("goose2017-05-29-0836")
MigrationSystem.Add("goose2017-05-30-1719")

MigrationSystem.Add("goose2017-06-21-1239",function(obj){
	for( var nodeID in obj.nodes ){
		var node = obj.nodes[nodeID]		
		if ( node.type == "gameState" ){
			node.outPins.unshift(-1)
		}
	}	
	return obj
})