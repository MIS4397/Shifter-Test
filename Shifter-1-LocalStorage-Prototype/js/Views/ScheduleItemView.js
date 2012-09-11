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
               this.remove();
               this.unrender();
           }, this);

       },
       render:function(){
           //Eventually want to hook this up to templates. But _ 's template engine doesn't work well. 
           var html = [],
               start = this.model.get('startTime'),
               end = this.model.get('endTime');
           html.push("<li data-role='list-divider' role='heading' class='ui-li ui-li-divider ui-btn ui-bar-d ui-li-has-count ui-btn-hover-undefined ui-btn-up-undefined'> ");
           html.push(start.toDateString());
           html.push("<span class='ui-li-count ui-btn-up-c ui-btn-corner-all'>1 Shift To Trade</span></li>");
           
           html.push("<li><a href='#myScheduleDialog' data-transition='pop' data-rel='dialog'>");
           html.push("<h3>SHIFT ASSIGNED</h3>");
           html.push("<p><strong>"+this.model.get('shiftPosition')+"</strong></p>");
           html.push("<p class='ui-li-aside'><strong>" + start.getHours() +":" + start.getMinutes() + " - "  + end.getHours() +":" + end.getMinutes() + "</strong></p>");
           html.push("</a></li>");
           
           /*
           html.push("<li data-theme='a' class='ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-a '>");
           html.push("<div class='ui-btn-inner ui-li'");
           html.push("<div class='ui-btn-text'>");
           html.push("<a href='#myScheduleDialog' data-transition='pop' data-rel='dialog'>");
           html.push("<h3>SHIFT ASSIGNED</h3>");
           html.push("<p><strong>"+this.model.get('shiftPosition')+"</strong></p>");
           html.push("<p class='ui-li-aside'><strong>" + start.getHours() +":" + start.getMinutes() + " - "  + end.getHours() +":" + end.getMinutes() + "</strong></p>");
           html.push("</a>");
           html.push("</div>");
           html.push("</div>");
           html.push("</li>");
           */
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
           $("#acceptTrade").off("click");
           $("#submitToBulletin").off("click");
           
           
           $("#submitToBulletin").on("click",{ model: this.model}, function(event){
               //create it in the oppisite store.
               shiftStore.create(event.data.model); //note shift = bulletin. need... to change that as well.
               event.data.model.trigger('destroyMe');
               $("#myScheduleDialog").dialog('close');
           });
           $.mobile.changePage("#myScheduleDialog");
       }
    });
})(Backbone, _);
