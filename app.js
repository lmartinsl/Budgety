// BUDGET CONTROLLER - Controle de Despesas
var budgetController = (function() {
    // Constructor Function
    var Expense = function(id, description, value) { // Despesas
        this.id             = id;
        this.description    = description;
        this.value          = value;
    };

    var Income = function(id, description, value) { // Receitas
        this.id             = id;
        this.description    = description;
        this.value          = value;
    };    
    
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
    };
    
    return {
        addItem: function(type, des, val) {
            var newItem, ID;
            
            //[1 2 3 4 5], next ID = 6
            //[1 2 4 6 8], next ID = 9
            // ID = last ID + 1

            // Create new ID - Obtendo o ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            // Create new item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val); // cria uma instância de Expense
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val); // Cria uma instância de Income
            }
            
            // Push it into our data structure
            data.allItems[type].push(newItem);
            
            // Return the new element
            return newItem;
        },    
        
        getData: function() {
            return data;
        }
    };
    
})();

// UI CONTROLLER
var UIController = (function() {
    
    var DOMstrings = {
        inputType	        : '.add__type',
        inputDescription	: '.add__description',
        inputValue	        : '.add__value',
        inputBtn	        : '.add__btn',
        incomeContainer	    : '.income__list',
        expensesContainer	: '.expenses__list',
        
    };        
    
    return {
        getInput: function() {
            return {
                type            : document.querySelector(DOMstrings.inputType).value, // Will be wither inc or exp
                description     : document.querySelector(DOMstrings.inputDescription).value,
                value           : parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },     
        
        addListItem: function(obj, type) {
            var html, newHtml, element;
            
            // Create HTML String with placeholder text
            if (type === 'inc') {
                
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                
            } else if (type === 'exp') {
                
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            }
            
            // Replace the placeholder text with some actual data
            // replace - procura por uma string e substitui por uma string pelos dados colocados no método
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // Insert the HTML into the DOM
            // DOM into html with income__container or expenses__container
                                                              //posição   //texto
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        clearFields: function() {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            // converte o fields para uma arrey
            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });

            fieldsArr[0].focus();
        },

        getDOMstrings: function() { // Expõe o DOMstrings para funções externas 
            return DOMstrings;
        }
    };
    
})();

// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {
    
    var setupEventListeners = function() {
        var DOM = UICtrl.getDOMstrings();
        
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13) { // Tecla Enter
                ctrlAddItem();
            }
        });     
    };    

    var updateBudget = function() {
        
        // 1. Calculate the budget


        // 2. Return the Budget
        

        // 3. Display the budget on the UI


    };
    
    var ctrlAddItem = function() {
        var input, newItem;
        
        // 1. Get the field input data
        input = UICtrl.getInput();        
        
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) { // verificar se é válido as informações

            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            // Verificate dados object
            var getInputs	 = UIController.getDOMstrings(); // Pega os campos
            var viewData	 = budgetController.getData(); // Pega os dados armazenados no objetos pelo UI
            var getData	     = document.querySelector(getInputs.inputType).value; // pega a string do campo 'add__type'

            console.log(viewData.allItems[getData]); // view the array into 'exp' or 'inc'

            // 3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);
            
            // 4. Clear de Fields
            UICtrl.clearFields();

            // 5. Calculate and update budget
            updateBudget();

        }

    };   
    
    return {
        init: function() {
            console.log('Application has started.');
            setupEventListeners();
        }
    };
    
})(budgetController, UIController);

controller.init();