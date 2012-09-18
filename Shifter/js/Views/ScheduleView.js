
//javascripts form of import statements
;
var ScheduleView = (function($, Backbone, _, ShiftCollection , Store){
return  Backbone.View.extend({
        el: "#scheduleList", //this should be the element that the view is "attached" to
        initialize:function(){
            _.bindAll(this, 'render', 'appendNewShift'); //precaution to make sure that all of the view's this points to the view.
            
            //If collection isn't passed in create a new one]
            //options is needed to access anything that was passed in via an object
            if(!this.options.collection){
                this.collection = new ShiftCollection([],{localStorage: this.options.localStore});
            }
            this.firstLoad = true;
        },
        fetchData: function(){
            this.collection.fetch();
        },
        render: function(){     //Clears the html and then redoes it.
            //clears the page
            this.unrender();
            
            //render existing collection
            _.each(this.collection.models, function(shift){
                this.appendNewShift(shift);
            }, this); //beaware need to send in this or else this inside the callback will be off.
           
           //This is here because listview('refresh') dosen't ike to be called on first pass
           //so the first time this gets called we do nothing.
           if(this.firstLoad){
               this.firstLoad = false;
           }else{
               this.$el.listview('refresh');    //tells jquery mobile to refresh the page
           }
            
        },
        unrender: function(){
            this.$el.empty();
        },
        //appendNewShift is trigged by the collection's add event and handles the html update
        appendNewShift: function(shift){
            
            //As of now (3/16/2012) the templates are causig more issues than they really are solving.
            //Should look into using them later. 
            
            //this returns a string with the template inside of it, used for underscores template engine
           //this.... might be better served if this was a property of something of the object
       //    var itemTemplate = $("#shift-li-template").html();
           
          //Have to use model.attributes or create an object with the property names associated with the template.
          //potential error. IF the template has attribute names that arn't included in the object sent in then
          //it tends to throw errors. Watchout for that.
         //  this.$el.append(_.template(itemTemplate, shift.attributes )); //.listview('refresh')
           
           var html = [],
               start = shift.get('startTime'),
               end = shift.get('endTime');
           html.push("<li>");
           html.push(shift.id + " <br />");
           html.push((start.getMonth() + 1) + " / " + start.getDate() + " / "  + start.getFullYear() + " <br />");
           html.push(start.getHours() +":" + start.getMinutes() + " - "  + end.getHours() +":" + end.getMinutes() + " <br />");
           html.push("</li>");
           this.$el.append(html.join(""));

        }
    });
})($, Backbone, _ , ShiftCollection , Store ); //wrapper function
