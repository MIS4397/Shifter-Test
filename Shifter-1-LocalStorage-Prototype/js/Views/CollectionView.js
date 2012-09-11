
var CollectionView = (function(Backbone, _){

    var ItemView = Backbone.View.extend({
       tagName: "li",   //This could be a div for agnostic sakes. This view assumes it will be in a list.
       events:{
           "click button.removeItem": "removeItem"
       },
       initialize: function(){
           _.bindAll(this, 'render', 'unrender', 'remove', 'removeItem');
           
           if(!this.model){
               throw new Error("model is not defined");
           }
           //Don't want to test this. So i'm being a bad person. This all of this code is bad.
           this.model.bind("remove", this.unrender);
       },
       render:function(){
           //Eventually want to hook this up to templates. But _ 's template engine doesn't work well. 
           var html = [];
           html.push("<li>");
           html.push("This is bad code test it.")
           html.push("</li>");
           this.$el.append(html.join(""));
           return this; //here for chainabe calls
           //And if i'm not mistaken until render is called this.el isn't much.
       },
       //Why do we need 3 of these? figure this out. (or well yea.)
       unrender: function(){
            this.$el.remove();
       },
       remove: function(){
           this.model.destroy(); //Heyo! a new test~
       },
       removeItem: function(){
           this.remove();
       }
    });
    
return  Backbone.View.extend({
    //This will be the element that the view is "attached" to and will append generated html inside it. 
        el: "",
        initialize:function(){
            _.bindAll(this, 'render', 'appendItem'); //precaution to make sure that all of the view's this points to the view.

           //Why do this/ If colleciton isn't passed in throw an error (needs a colleciton to render.)
            if(!this.options.collection){
                throw new Error("collection must be passed into construtor of CollectionView.");
                this.collection = new ShiftCollection([],{localStorage: this.options.localStore});
            }
            //We could do a deafult colleciton with default models... but forget that . (though for testing? possibly)
            this.collection = this.options.collection;
            //TODO Maybe create a default item view?
            if(!this.options.itemView){
                //TODO Test that this is acutally a funciton
                //throw new Error("itemView must be passed into constructor of CollectionView");
                //item view wouldn't be too bad. 
                console.log(this.options.itemView);
                this.itemView = ItemView;
            }
            else{
                this.itemView = this.options.itemView;
            }
            if(!this.options.el){
                throw new Error("el must be defined");
            }
            this.el = this.options.el;
            
            this.collection.bind("add", function(data){
                console.log("something was added ");
                console.log(data);
            });
            
            this.collection.bind("remove", function(data){
                console.log("something was removed ");
                console.log(data);
            });
            
            //here for jquery mobile bugs. This means this has another dependacies. Need ot change this. 
            this.firstLoad = true;
        },
        fetchData: function(){
            this.collection.fetch();
        },
        //At this moment render is called by an external caller once they want to update the page.
        //this could instead be put into the fetch data tag.
        
        //Render => creates html for every item within the collection. If you want to add a single one
        //use append Item.
        render: function(){
            //clears the page
            this.unrender();
            
            //render existing collection
            _.each(this.collection.models, function(item){
                this.appendItem(item);
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
        //forget this. Add a itemView (that is passed in the constructor)
        //Interface! that way we just change how the colleciton is being rendered by the item view sent it. 
        //I would like the collections add handler to call this instead of just render.
        //but due to the fact that fetch doesn't call this individual that is not happening.
        appendItem: function(item){
            var itemView = new this.itemView({model:item, collection: this});
            this.$el.append(itemView.render().el);
        }
    });
})(Backbone, _); //wrapper function
