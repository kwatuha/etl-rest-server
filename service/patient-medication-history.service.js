
const _ = require('lodash');
export class patientMedicationHistService {

    processMedicationHistory(data) {  
        var revisedResults=[];
        var indexedResults=indexResults(data);
        var dateStopped='';
        var processed='';
        var count=0;
        var currentRegimen='';
        var previousRegimen='';

        _.each(data.result, function (result) {           
            try{

                if(result){
                currentRegimen=result.current_regimen;
                currentRegimen=handleRegimenCombination(currentRegimen);
                currentRegimen=resortNames(currentRegimen);

                previousRegimen= result.previous_regimen;
                previousRegimen=handleRegimenCombination(previousRegimen);
                previousRegimen=resortNames(previousRegimen);
                }
                if(result && previousRegimen.split(',').sort().join(',')===currentRegimen.split(',').sort().join(',') || currentRegimen==='' ){   
                    // do not include medication data when current and previous regimen are same
                }else{
                  result['prev_regimen_date_stopped'] =indexedResults[count+1].encounter_datetime;
                  revisedResults.push(result)  
                }
              
            } catch(error){
           console.log(error)
            }
           count++;
        });
        data.result=revisedResults;
       return includeDateStopped(data);
    }

    
}

function indexResults(data){
     var results=[];
     var count=0;
      _.each(data.result, function (result) {
            results[count]=result;
            count++;
      });
      return results;
}

function includeDateStopped(data){
   var count=0;
   var dataInd=indexResults(data);
   var revisedResults=[];
 _.each(data.result, function (result) {
            if(result){
                try{
                    result['current_regimen_date_stopped']=dataInd[count-1]?dataInd[count-1].prev_regimen_date_stopped:'';
                    revisedResults.push(result);

                }catch(err){
                  console.log(err);
                }
                
            }
            count++;
      });
      data.result=revisedResults;
      return data;
}

function handleRegimenCombination(str){
   //handle regimen combination 
   str = str.trim().split(" AND ").sort().join(',');
    return str;
}

function resortNames(str){
   var strArr=str.trim().split(",");
   var s=strArr.sort().join('#');
   return str.split(',').sort().join(',').replace(/ /g, '');
}