class TravelPlanManager {
    constructor() {
        this.storageKey = "jomjalan_plans";
        this.initListeners();
        this.renderPlansList();
    }

    // Mengambil data daripada LocalStorage
    getPlans() {
        const data = localStorage.getItem(this.storageKey);
        if (!data) {
            return [];
        }
        return JSON.parse(data);
    }

    // Menyimpan data ke LocalStorage
    savePlansToStorage(plans) {
        localStorage.setItem(this.storageKey, JSON.stringify(plans));
    }

    // Memulakan pendengar acara (Event Listeners)
    initListeners() {
        document.addEventListener("DOMContentLoaded", () => {
            const planForm = document.getElementById("planForm");
            const cancelEditBtn = document.getElementById("cancelEditBtn");

            if (planForm) {
                planForm.addEventListener("submit", (e) => {
                    e.preventDefault();
                    this.handleFormSubmit();
                });
            }

            if (cancelEditBtn) {
                cancelEditBtn.addEventListener("click", () => {
                    this.resetFormState();
                    document.getElementById("planForm").reset();
                });
            }
        });
    }

    // Mengendalikan penghantaran borang (Create & Update) tanpa operator ||
    handleFormSubmit() {
        const title = document.getElementById("planTitleInput").value.trim();
        const destination = document.getElementById("destinationInput").value.trim();
        const budget = document.getElementById("budgetInput").value.trim();
        const activities = document.getElementById("activitiesInput").value.trim();
        const editIndex = document.getElementById("editIndex").value;

        if (title === "") {
            alert("Please fill in the travel plan title!");
            return;
        }

        if (destination === "") {
            alert("Please fill in the destination!");
            return;
        }

        if (budget === "") {
            alert("Please fill in the budget!");
            return;
        }

        if (activities === "") {
            alert("Please fill in the activities!");
            return;
        }

        const planObj = {
            title,
            destination,
            budget: Number(budget).toLocaleString(),
            activities,
            updatedAt: new Date().toLocaleDateString()
        };

        const plans = this.getPlans();

        if (editIndex === "") {
            plans.push(planObj);
            alert("Travel plan successfully saved!");
        } else {
            plans[editIndex] = planObj;
            alert("Travel plan successfully updated!");
        }

        this.savePlansToStorage(plans);
        document.getElementById("planForm").reset();
        this.resetFormState();
        this.renderPlansList();
    }

    // Mempamerkan senarai rancangan ke DOM
    renderPlansList() {
        const container = document.getElementById("plansListContainer");
        if (!container) return;

        container.innerHTML = "";
        const plans = this.getPlans();

        if (plans.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #94a3b8;">
                    <i class="fa-solid fa-folder-open" style="font-size: 2rem; margin-bottom: 8px;"></i>
                    <p>No saved travel plans found. Create a new plan!</p>
                </div>
            `;
            return;
        }

        plans.forEach((plan, index) => {
            const card = document.createElement("div");
            card.style.cssText = "background: #ffffff; padding: 16px; border-radius: 8px; position: relative; border-bottom: 1px solid #e2e8f0; display: flex; flex-direction: column; gap: 6px;";
            
            card.innerHTML = `
                <h4 style="color: var(--primary); font-size: 1.05rem; margin: 0;"><i class="fa-solid fa-plane"></i> ${plan.title}</h4>
                <p style="font-size: 0.85rem; color: var(--text-muted);"><strong>Destination:</strong> ${plan.destination}</p>
                <p style="font-size: 0.85rem; color: #16a34a;"><strong>Estimated Budget:</strong> RM ${plan.budget}</p>
                <p style="font-size: 0.9rem; color: var(--text-main); white-space: pre-line; line-height: 1.4;"><strong>Activities:</strong><br>${plan.activities}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px;">
                    <span style="font-size: 0.75rem; color: #94a3b8;"><i class="fa-regular fa-clock"></i> Updated: ${plan.updatedAt}</span>
                    <div style="display: flex; gap: 6px;">
                        <button onclick="planManager.prepareEditPlan(${index})" style="background: transparent; color: var(--primary-accent); border: 1px solid #cbd5e1; padding: 4px 10px; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">
                            <i class="fa-solid fa-pen"></i> Edit
                        </button>
                        <button onclick="planManager.removePlan(${index})" style="background: transparent; color: #ef4444; border: 1px solid #cbd5e1; padding: 4px 10px; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">
                            <i class="fa-solid fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    }

    // Bersedia untuk menyunting rancangan
    prepareEditPlan(index) {
        const plans = this.getPlans();
        const plan = plans[index];

        if (!plan) return;

        document.getElementById("planTitleInput").value = plan.title;
        document.getElementById("destinationInput").value = plan.destination;
        document.getElementById("budgetInput").value = plan.budget.replace(/,/g, '');
        document.getElementById("activitiesInput").value = plan.activities;
        document.getElementById("editIndex").value = index;

        document.getElementById("formTitle").innerText = "Edit Travel Plan";
        document.getElementById("saveBtn").innerHTML = `<i class="fa-solid fa-check"></i> Update Plan`;
        document.getElementById("cancelEditBtn").style.display = "block";
    }

    // Memadam rancangan
    removePlan(index) {
        if (confirm("Are you sure you want to delete this travel plan?")) {
            const plans = this.getPlans();
            plans.splice(index, 1);
            this.savePlansToStorage(plans);
            this.renderPlansList();
            this.resetFormState();
        }
    }

    // Menetapkan semula status borang
    resetFormState() {
        document.getElementById("editIndex").value = "";
        document.getElementById("formTitle").innerText = "Create New Travel Plan";
        document.getElementById("saveBtn").innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Save Plan`;
        document.getElementById("cancelEditBtn").style.display = "none";
    }
}

// Menjadikan objek boleh diakses secara global untuk butang HTML onclick
const planManager = new TravelPlanManager();