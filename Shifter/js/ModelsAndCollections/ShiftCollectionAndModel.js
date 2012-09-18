;
var Shift = (function(Backbone){
    return Backbone.Model.extend({
        defaults:{
            name: "Default Name",
            startTime: new Date(2000, 0, 1, 0, 0),
            endTime: new Date(2000, 1, 2, 1, 1)
        },
        initialize: function(){
            if(this.attributes.localStorage){
                //Enables us to pass localStorage into the constructor
                //reason for attaching to object directly is because Backbone.localStorage
                //expects it to be like this.
                this.localStorage = this.attributes.localStorage;
                //WARNING if you don't delete this attribute then each model that can sync its self
                //will save a copy of the entire localStorage in its model. Not sure the side effects
                //of the delete line. Probably should read the below link before hand. 
                //read http://perfectionkills.com/understanding-delete/
                delete this.attributes.localStorage;
            }
            /*
            this.bind("change", function(){
                console.log("model was changed");
            });
            */
        },
        //This probably deserves a "patchwork" code comment
        //Reason this exists is because getting data back form the localstorage (and i'm thinking json in general)
        //results in a string instead of a date object. So this catchs the startTime / endTime returned
        //by save / fetch (might be more this is waht bakbone states) and turns them into a date object.
        //Although if it is an object passed in with attributes, I think this is just a regular model object so we just return
        //that in because the startTime / endTime are already Date objects. 
        //WARNING this code has a chance of breaking because we are assuming the input is good. a
        parse: function(response){
            if(response.attributes){
                return response;
            }
            if(response.startTime){
                response.startTime = new Date(response.startTime);
            }
            if(response.endTime){
                response.endTime = new Date(response.endTime);
            }
            return response;
        }
        
    });
    
})(Backbone );

var ShiftCollection = (function(Backbone, _ ){
    
return Backbone.Collection.extend({
        model: Shift,
        initialize: function(){
            //Because backbone has no way of passing in properties that you want to add to the collection
            //during runtime, the below lines are my way of hacking that togther. It is a possiblity
            //of fleshing this out with an extend call or something. But I'm only interested in localStorage
            //so that is only what I get.
            //I put it in the second parameter, because the first one will be shoved into the collection and
            //we don't to do that due to unexpected side effects.
            if(arguments[1]){   //looking for ShiftCollection([anything],{localStorage:myStore})
                this.localStorage = arguments[1]["localStorage"];
            }
    },
    //we sort by startTime
    comparator: function(shift){
        return shift.get('startTime');
    }
    });//Shift List

})( Backbone, _ );