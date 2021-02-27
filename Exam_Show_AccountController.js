({
  onInit: function(component, event, helper) {
    // Setting column information.To make a column sortable,set sortable as true on component load
    component.set("v.accountColumns", [
      {
        label: "Name",
        fieldName: "Name",
        type: "text",
        sortable: true
      },
      {
        label: "Owner",
        fieldName: "Swagata__AccountOwnerName__c",
        type: "text",
        sortable: true
      },
      {
        label: "Phone",
        fieldName: "Phone",
        type: "Phone"
      },
      {
        label: "Website",
        fieldName: "Website",
        type: "url"
      },
      {
        label: "AnnualRevenue",
        fieldName: "AnnualRevenue",
        type: "Text"
      }
    ]);
    // call helper function to fetch account data from apex
    helper.getAccountData(component);
  },

  //Method gets called by onsort action,
  handleSort: function(component, event, helper) {
    //Returns the field which has to be sorted
    var sortBy = event.getParam("fieldName");
    //returns the direction of sorting like asc or desc
    var sortDirection = event.getParam("sortDirection");
    //Set the sortBy and SortDirection attributes
    component.set("v.sortBy", sortBy);
    component.set("v.sortDirection", sortDirection);
    // call sortData helper function
    helper.sortData(component, sortBy, sortDirection);
  },

  onSave: function(component, event, helper) {
    console.log("Inside the onsave ---");
    var draftValues = event.getParam("draftValues");
    //var updatedRecords = component.find( "accountTable" ).get( "v.draftValues" );
    var action = component.get("c.updateAccts");
    action.setParams({
      updatedAccountList: draftValues
    });
    action.setCallback(this, function(response) {
      var state = response.getState();
      if (state === "SUCCESS") {
        if (response.getReturnValue() === true) {
          helper.toastMsg("success", "Records Saved Successfully.");
          component.find("accountTable").set("v.draftValues", null);
        } else {
          helper.toastMsg(
            "error",
            "Something went wrong. Contact your system administrator."
          );
        }
      } else {
        helper.toastMsg(
          "error",
          "Something went wrong. Contact your system administrator."
        );
      }
    });
    $A.enqueueAction(action);
  }
});
