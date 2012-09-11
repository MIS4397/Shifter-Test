var ShiftItemView = (function(Backbone, _){
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
               html.push("<li><a href='' data-rel='dialog' data-transition='pop'>");
               html.push("<h3>"+start.toDateString()+"</h3>");
               html.push("<p><strong>"+this.model.get('shiftPosition')+"</strong></p>");
               html.push("<p>"+this.model.get('lastName')+","+this.model.get('firstName')+"</p>");
               html.push("<p class='ui-li-aside'><strong>" + start.getHours() +":" + start.getMinutes() + " - "  + end.getHours() +":" + end.getMinutes() + "</strong></p>");
               html.push("</a></li>");
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
           
           
           $("#acceptTrade").on("click",{ model: this.model}, function(event){
               //WARNING GLOBAL VARIABLES
               scheduleStore.create(event.data.model);
               event.data.model.trigger('destroyMe');
               $("#bulletinBoardDialog").dialog('close');
           });
           $.mobile.changePage("#bulletinBoardDialog");
       }
    });
})(Backbone, _);
