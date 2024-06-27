({
    openRecord : function (component, event, helper) {
        let recId = event.currentTarget.dataset.whoid;
        let navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
            "recordId": recId
        });
        navEvt.fire();
    },
    
    selectAll: function(component, event, helper) {
        let isSelected = event.getSource().get('v.checked');
        var allParents = component.get('v.chatMessagesMap');
        allParents.forEach(member => {
            member.isSelected = isSelected;
        });
            component.set('v.chatMessagesMap', allParents);
        },
            
            changeAction: function(component, event, helper) {
                var utilityBarAPI = component.find("utilitybar");
                utilityBarAPI.getUtilityInfo().then(function(response){
                    if(response.utilityVisible){
                        component.set('v.isUtilityOpen', true);
                    }else{
                        component.set('v.isUtilityOpen', false);
                    }
                })
                component.set('v.isLoading', true);
                let displayType = component.get('v.displayType');
                let selectedAction = event.getSource().get('v.value');
                let wrapperList = component.get('v.chatMessagesMap');
                var action = component.get('c.updateParentfromUI');
                action.setParams({
                    selectedAction: selectedAction,
                    displayType: displayType,
                    LeadContactWrapperList: wrapperList,
                });
                action.setCallback(this, function(response) {
                    var state = response.getState();
                    if (state === 'SUCCESS') {
                        var result = response.getReturnValue();
                        component.set('v.chatMessagesMap', result.objLeadContactWrapperList);
                        helper.getChatHistory(component, event, helper);
                        component.find("selectAction").set("v.value", 'Select an Action');
                        component.find("selectAllCheck").set("v.checked", false);
                        component.set('v.openChatHistory', false);
                        var utilityAPI = component.find('utilitybar');
                        if(result.objUnreadMessageCount > 0){
                            utilityAPI.setUtilityLabel({label: 'Messages (' + result.objUnreadMessageCount + ')'});
                            utilityAPI.setUtilityHighlighted({highlighted: true});
                        }else{
                            utilityAPI.setUtilityLabel({label: 'Messages'});
                            utilityAPI.setUtilityHighlighted({highlighted: false});
                        }
                        utilityAPI.setPanelWidth({
                            widthPX: 500,
                        });
                        utilityAPI.setPanelHeight({
                            heightPX : 500,
                        });
                    }
                    component.set('v.isLoading', false);
                });
                $A.enqueueAction(action);
            },
            
            displaySelect: function(component, event, helper) {
                var utilityBarAPI = component.find("utilitybar");
                utilityBarAPI.getUtilityInfo().then(function(response){
                    if(response.utilityVisible){
                        component.set('v.isUtilityOpen', true);
                    }else{
                        component.set('v.isUtilityOpen', false);
                    }
                })
                component.set('v.isLoading', true);
                component.set('v.displayType',event.getSource().get('v.value'));
                helper.getChatHistory(component, event, helper);
                component.set('v.openChatHistory', false);
                var utilityAPI = component.find('utilitybar');
                utilityAPI.setPanelWidth({
                    widthPX: 500,
                });
                utilityAPI.setPanelHeight({
                    heightPX : 500,
                });
                component.find("selectAllCheck").set("v.checked", false);
            },
            doInit: function(component, event, helper) {
                helper.StaticResourceName(component, event, helper);
                
                
                // Get the empApi component
                const empApi = component.find('empApi');
                const replayId = -1;
                const channel = '/topic/Messagenotifications_OEM';
                // Subscribe to an event
                empApi
                .subscribe(
                    channel,
                    replayId,
                    $A.getCallback(eventReceived => {
                        
                        if(eventReceived.data.event.type == 'created'){
                        helper.StaticResourceName(component, event, helper);
                        var stName = component.get('v.static_resourceName');
                        if(stName !== '' && stName !== null){
                        var getSound = $A.get('$Resource.'+stName);
                        var playSound = new Audio(getSound);
                        playSound.play();
                    }
                                   }
                                   // Process event (this is called each time we receive an event)
                                   if(eventReceived.data && eventReceived.data.sobject){                
                    let parentRecordId = component.get('v.recId');
                if(parentRecordId && parentRecordId == eventReceived.data.sobject.Parent_SObject_Id__c){                        
                    var utilityBarAPI = component.find("utilitybar");
                    utilityBarAPI.getUtilityInfo().then(function(response){
                        if(response.utilityVisible){
                            if(component.get('v.openChatHistory') == true){
                                component.set('v.openChatHistory', false);
                                component.set('v.openChatHistory', true);  
                                helper.updateChatHistory(component, event, helper);
                            }
                        }
                        helper.getChatHistory(component, event, helper);
                        helper.getUnreadSMS(component, event, helper);
                    })
                    .catch(function(error){});
                }else{
                    helper.getChatHistory(component, event, helper);
                    helper.getUnreadSMS(component, event, helper);
                }
            }
        })
        ).then(subscription => {});
        
        
        helper.getUnreadSMS(component, event, helper);
        helper.getChatHistory(component, event, helper);
    },
    handleConfirmDialogCancel : function(component, event, helper) {
        console.log('No');
        component.set('v.showConfirmDialogBox', false);
        $A.get("e.force:closeQuickAction").fire();
        $A.get('e.force:refreshView').fire();
    },
    
    openChatHistory: function(component, event, helper) {
        var val = event.currentTarget.id;
        component.set('v.recId', val);
        component.set('v.openChatHistory', false);
        component.set('v.openChatHistory', true);
        component.set('v.openOrphanMessage', false);
        var imgeUpload = component.get('v.openChatHistory');
        var utilityAPI = component.find('utilitybar');
        utilityAPI.setPanelWidth({
            widthPX: 700,
        });
        utilityAPI.setPanelHeight({
            heightPX : 500,
        });
        
        let msglist = document.getElementById(val);
        let msgcount = msglist.dataset.msgcount;
        if(msgcount != null && msgcount != undefined && msgcount > 0){
            helper.updateChatHistory(component, event, helper);
            helper.getChatHistory(component, event, helper);
            helper.getUnreadSMS(component, event, helper);
        }
    },
    
    openOrphanMessages: function(component, event, helper) {
        component.set('v.openOrphanMessage', false);
        component.set('v.openOrphanMessage', true);
        component.set('v.openChatHistory', false);
        
        var utilityAPI = component.find('utilitybar');
        utilityAPI.setPanelWidth({
            widthPX: 700,
        });
        utilityAPI.setPanelHeight({
            heightPX : 500,
        });
        helper.getChatHistory(component, event, helper);
        helper.getUnreadSMS(component, event, helper);
    },
});