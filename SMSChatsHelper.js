({
    
    getUnreadSMS: function(component, event, helper) {
        var action = component.get('c.getReceivedUnreadMessages');
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                var result = response.getReturnValue();
                component.set('v.tasks', result);
                component.set('v.unreadMsgCount', result.length);
                if(result && result.length > 0){
                    var utilityAPI = component.find('utilitybar');
                    utilityAPI.setUtilityLabel({label: 'Messages (' + result.length + ')'});
                    utilityAPI.setUtilityHighlighted({highlighted: true});
                }
            }
            
        });
        $A.enqueueAction(action);
    },
    
    getChatHistory: function(component, event, helper) {
        var displayType = component.get('v.displayType');
        var action = component.get('c.getMessageList');
        action.setParams({displayType: displayType});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                var result = response.getReturnValue();
                component.set('v.chatMessagesMap', result);
                component.set('v.isLoading', false);
            }
        });
        $A.enqueueAction(action);
    },
    
    updateChatHistory: function(component, event, helper) {
        var recordId = component.get('v.recId');
        var action = component.get('c.updateReadMessages');
        action.setParams({recId: recordId});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                var result = response.getReturnValue();
                //component.set('v.chatMessagesMap', result);
                var utilityAPI = component.find('utilitybar');
                utilityAPI.setUtilityLabel({label: 'Messages'});
                utilityAPI.setUtilityHighlighted({highlighted: false});
            }
        });
        $A.enqueueAction(action);
    },
    StaticResourceName: function(component, event, helper) {
        var action = component.get('c.getStaticResourceName');
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
               var result = response.getReturnValue();
                component.set('v.static_resourceName', result); 
            }
            
        });
        $A.enqueueAction(action);
    }
});