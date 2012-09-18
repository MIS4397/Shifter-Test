
//MC stands for Model and Collections
(function(Shift, ShiftCollection, _ ){
    //variables get defined at top of functions anyway so making this clear.
    var localStore;
    
    //Helper methods
    //Tests to make sure that the the model passed in contains the default parameters and values for said parameters.
    //WARNING doesn't test other parameters so watch out
    //The reason why we test each one by name instead of doing a forin loop or the like is because
    //we need a special case if they are an date object. Seeing how typeof() doesn't say its a date object.
    
    //Thinking about it we could do a forin and test each property if it has a date method associated with it
    //But this works for the moment. So if we want to change this, then that is a route we can go.
    //Or if you find a way to test if an object is a type of object you expect it to be. (e.g date)
    var shiftDefaultsUnchanged = function(model){
        //go through each property and if it doesnt exist or if its not equal to the default prop then its not good.
        
        if(model.attributes["name"] !== model.defaults["name"]){
            return false;
        }
        if(!isSameDate(model.attributes["startTime"], model.defaults["startTime"])){
            return false;
        }
        if(!isSameDate(model.attributes["endTime"], model.defaults["endTime"])){
            return false;
        }
        return true; //if we arrive here everything should be good. 
    }
    
    //Simple helper method used to compare the name attribute for shift models.
    //don't expect it to be error free. if you throw something that isn't a date object.
    var isSameDate = function(date1, date2){
        //dates are equal if you subtract them they are equal to zeros
        return ((date1 - date2) === 0) ? true : false;
    }
    
    
    //******************************************Shift ***************************************************************    
    module("Shift");
    test("Basic Functionality", function(){
        var testShift = new Shift();
        ok(shiftDefaultsUnchanged(testShift), "Testing created properties against defaults in model.(Seeing if defaults were assigned correctly)");
        
        testShift.set({name:"Hello World"});
        
        equal(testShift.get('name'), "Hello World", "Can Set and Get properties.");
    });//Shift Basic Functionality
    
    //******************************************Shift Collection***************************************************************
    module("Shift Collection");
    //These tests are just to test the basic backbone functionality of a collection object.
    //if these blow up it should be because of something we wrote (hopefully)
    test("Basic Functionlity", function(){
        var testCollection = new ShiftCollection(),
            testShift = new Shift({startTime:new Date(2000, 1, 5, 7)});
        equal(testCollection.length, 0, "Collection is empty upon creation");

        testCollection.add(testShift);
        equal(testCollection.length, 1 , "Can Add elements ");
        equal(testCollection.at(0), testShift, "Elements are the same as put in.");

        testCollection.add(generateShifts(2));
        equal(testCollection.length, 3, "Can add multiple elements");
        
        //tests that the shifts are indeed sorted upon insertion
        ok((function(){
            //get each shift in the colleciton's attributes
            var shiftsAttr = _.pluck(testCollection.models, 'attributes'),
            count = 0,
            len = shiftsAttr.length;
            for(count; count < len-1; ++count){
                if(shiftsAttr[count].startTime > shiftsAttr[count+1].startTime){
                    return false;
                }
            }
            return true;
        })(), "Shifts are sorted based on startTime upon insertion into the collection");
        
    });//Collection Basic Functionality
    
    //******************************************Shift Local Storage***************************************************************
    localStore = new Store("MCTests");
    //Theses tests are here to make sure that sending a store object into the parameters of a shiftColleciton
    //works as intended. Few notes on usage are sprinkeled in here. 
    test("localStorage Parameter Testing", function(){
        var paramCollection,
            paramModel;
        
        //As of the writing of this (3.16.12) the way to send a store object into a collection is the following
        //ShiftColleciton([starting, models], {localStorage:myStore}) this test checks that if you send a 
        //parameter object that doesn't have a localStorage then the code won't blow up. 
        ok((function(){
            paramCollection = new ShiftCollection([],{notLocal:"nope"});
            return true;
        })(), "Testing that passing in an parameter object to ShiftCollection does not blow up the code.");
        
        equal(paramCollection.length, 0, "Collection is empty upon creation.");
    
        //This is here just in case redoing the object would cause errors.
        paramCollection = null;
        equal(paramCollection, null, "Collection is null before recreating");
        
        //inserting the localStorage the proper way.
        paramCollection = new ShiftCollection([], {localStorage:localStore});
        equal(paramCollection.localStorage, localStore, "localStorage is defined on collection and set to our localStore variable.");
        
        paramModel = new Shift({localStorage:localStore});
        //Why test .localStorage instead of .get('localStorage')? Well because that is how Backbone.localStorage expects it. 
        equal(paramModel.localStorage, localStore, "localStorage is defined on model and set to our localStore variable.");
    });//parameter Testing
    
    
    module("Shift");
    //Testing individual model saving / fetching from the local storeage. 
    //not sure if shift will save on an individual basis like the code below. But the colleciton
    //should preform that for us. But its good to know that the collection's saving/fetching works
    //as we expect it to.
    test("localStore Syncing", function(){
        //Model / Collection that will be synced up with our storage using Backbone.localStorage
        //BUG warning. Since they use the same localStore I'm going to take a guess that they will save using
        //the same signiture. making it to where if you save a model, the colleciton will think its apart of 
        //its colleciton even though you did not state it in the code. We could test this. But this is a warning.
        //kill the store before you start any tests. 
        var syncModel = new Shift({localStorage:localStore}),
            newName = "Hello World",
            newEndTime = new Date();
            newEndTime.setDate(newEndTime.getDate()+2);
         
         localStore.killStore();
         
         ok(shiftDefaultsUnchanged(syncModel), "Newly created model default properties remain the same");

         syncModel.fetch();
         ok(shiftDefaultsUnchanged(syncModel), "Properties remain the default value after fetching without saving");

         syncModel.save();
         syncModel.fetch();
         ok(shiftDefaultsUnchanged(syncModel), "Properties remain the default value after saving and fetching.");
         
         syncModel.set({name:newName, endTime:newEndTime});
         syncModel.save();
         equal(syncModel.get('name'), newName, "Setting and Saving a new name for the Model");
         equal(syncModel.get('endTime'), newEndTime, "Setting and Saving a new endTime for the model" );
         
         syncModel.set({name:"test", endTime: new Date()});
         equal(syncModel.get('name'), "test", "Model name is diffrent after setter");
         notEqual(syncModel.get('endTime'), newEndTime, "Model endTime is diffrent after setter");
         
         syncModel.fetch();
         equal(syncModel.get('name'), newName, "Fetched name is equal to saved value.");
         //Equal doesn't like date objects. so have to use our helper method.
         ok(isSameDate(syncModel.get('endTime'), newEndTime),"Fetched endTime is equal to saved Value" );

        localStore.killStore();
    });
    
    
    module("Shift Collection");
    
    test("localStore Syncing", function(){
        //See above bug warning about potential conflicts. 
        var syncCollection = new ShiftCollection([],{localStorage:localStore});
        localStore.killStore();
         
        equal(syncCollection.length, 0, "Collection is empty upon creation");
        
        syncCollection.fetch();
        equal(syncCollection.length, 0, "localStorage returns an empty collection on start.");
        
        syncCollection.add(generateShifts(5));
        equal(syncCollection.length, 5, "Collection has elements inside of it before a new fetch.");
        
        syncCollection.fetch()
        equal(syncCollection.length, 0, "Collection empties itself after requesting for a empty localStorage");
        
        syncCollection.add(generateShifts(5));
        equal(syncCollection.length, 5, "Collection has elements inside of it before it is saved to localStorage");
        syncCollection.each(function(shift){
            shift.save();
        });
        
        syncCollection.reset();
        equal(syncCollection.length, 0, "Collection is empty before fetching data from localStorage");
        
        syncCollection.fetch();
        equal(syncCollection.length, 5, "Collection recieved the elements it saved from storage.");
        
        localStore.create(new Shift());
        localStore.create(new Shift({startTime:new Date(2002, 1, 1)}));
        
        syncCollection.fetch();
        equal(syncCollection.length, 7, "Collection recieved the elements created by localStore.");
        //console.log(syncCollection);
        //TODO honestly, probably need to do some testing on the actual things returned by the colleciton
        //make sure its acutaly the stuff we saved. (we kinda do that already with shift tests so *shurg*)

        localStore.killStore();
    });
    
    //helps with testing collections, send in the number that you wish to generate and it returns
    //an array with said amount of shifts. 
    var generateShifts = function(numToGen){
        var shiftArr = [],
            count = 0;
        for(count; count < numToGen; ++count){
            shiftArr.push(new Shift({
                startTime: new Date(2000, 1, 4+count, 7),
                endTime: new Date(2000, 1, 4+count, 9)
            }));
        }
        return shiftArr;
    }
})(Shift, ShiftCollection, _);