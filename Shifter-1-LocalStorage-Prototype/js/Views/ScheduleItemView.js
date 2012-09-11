var ScheduleItemView = (function(Backbone, _){
    //Represents each individual shift item within the view
    //and handles the functionality of each item. 
    return Backbone.View.extend({
       tagName: "li",   //ShiftItemView isn't attached to anything so will use this to create a html element
       className:"shiftItem",
       events:{
           "click li": "showDialog"
       },
       initialize: function(){
           _.bindAll(this, 'render', 'remove', 'showDialog');
           if(typeof(this.model) === 'undefined'){
               throw new Error("Model must be defined in ShiftItemView");
           }
           //if i'm not mistaken remove is a event that backbone propagates.
           //this.model.bind("remove", this.unrender);
           this.model.bind("destroyMe", function(){
               console.log("in shechdle destory");
               console.log(this.model);
               this.remove();
               this.unrender();
           }, this);

       },
       render:function(){
           //Eventually want to hook this up to templates. But _ 's template engine doesn't work well. 
           var html = [],
               start = this.model.get('startTime'),
               end = this.model.get('endTime');
           html.push("<li>");
           html.push(this.model.id + " <br />");
           html.push((start.getMonth() + 1) + " / " + start.getDate() + " / "  + start.getFullYear() + " <br />");
           html.push(start.getHours() +":" + start.getMinutes() + " - "  + end.getHours() +":" + end.getMinutes() + " <br />");
           html.push("</li>");
           this.$el.append(html.join(""));
           return this; //here for chainabe calls
       },
       unrender: function(){
            this.$el.remove();
       },
       remove: function(){
           this.model.destroy(); //Heyo! a new test~
       },
       showDialog: function(){
           //removes any current click handlers on the button. (causes errors atm.)
           $("#acceptShiftDialog").off("click");
           $("#acceptScheduleDialog").off("click");
           $("#acceptScheduleDialog").on("click",{ model: this.model}, function(event){
               shiftStore.create(event.data.model);
               event.data.model.trigger('destroyMe');
               $("#scheduleDialog").dialog('close');
           });
           $.mobile.changePage("#scheduleDialog");
       }
    });
})(Backbone, _);
