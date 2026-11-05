const STORAGE_KEY = "jomjalan_plans";

function getSavedPlans() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

//task5 CRUD functionality and local strorage persistence
function savePlanToStorage(planObj, editIndex = "") {
    let plans = getSavedPlans();
    
    if (editIndex === "") {
        plans.push(planObj);
    } else {
        if (editIndex === null) {
            plans.push(planObj);
        } else {
            if (isNaN(editIndex)) {
                plans.push(planObj);
            } else {
                plans[editIndex] = planObj;
            }
        }
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
}

function deletePlanFromStorage(index) {
    let plans = getSavedPlans();
    plans.splice(index, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
}