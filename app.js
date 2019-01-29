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
    
    var calculateTotal = function(type) {
        var sum = 0;
        
        data.allItems[type].forEach(function(cur) {
            sum += cur.value; // A cada interação, é somado os valores do array de allItems.
        });

        data.totals[type] = sum; // Armazena o total no array de totals
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
        budget: 0,
        percentage: -1 // valor -1 é usado para para dizer que é algo inexistente.
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

        deleteItem: function(type, id) {
            var IDs, index;

            // id = 6
            // data.allIatems[type][id];
            // IDs = [1, 2, 4, 6, 8];
            // index = 3

            IDs = data.allItems[type].map(function(current){
                return current.id
            });

            index = IDs.indexOf(id);

            // splice   = remover elementos
            // slice    = slice para criar uma cópia
            if (index !== -1) {
                                        // posição // n de elementos
                data.allItems[type].splice(index, 1);

            }
        },

        calculateBudget: function() {

            // 1. Calculate income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // 2. Calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp; // receitas - despesas = total restante

            // 3. Calculate the percentage of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100); // Example: Expense = 100 and income = 200, spent 50% = 100/200 - 0.5 * 100
            } else {
                data.percentage = -1;
            }
        },

        getBudget: function() { // será retornado ao controlador do app que transmite para o método displayBudget
            return {
                budget      : data.budget,      // total
                totalInc    : data.totals.inc,  // total receitas
                totalExp	: data.totals.exp,  // total despesas
                percentage  : data.percentage	// porcentagem
            }
        },

        getData: function() {
            return data;
        }
    };
    
})();

// UI CONTROLLER
var UIController = (function() {
    
    // Armazenameno de classes names
    var DOMstrings = {
        inputType	        : '.add__type',                     // tipo de aplicação - receita(income)/despesas(expenses)
        inputDescription	: '.add__description',              // descrição
        inputValue	        : '.add__value',                    // valor
        inputBtn	        : '.add__btn',                      // botão para enviar dados
        incomeContainer	    : '.income__list',                  // div que separa as receitas
        expensesContainer	: '.expenses__list',                // div que separa as despesas
        budgetLabel	        : '.budget__value',                 // valor total
        incomeLabel	        : '.budget__income--value',         // total receitas
        expensesLabel	    : '.budget__expenses--value',       // total despesas
        percentageLabel	    : '.budget__expenses--percentage',  // porcentagem
        container           : '.container',                     //
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
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                
            } else if (type === 'exp') {
                
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            }
            
            // Replace the placeholder text with some actual data
            // replace - procura por uma string e substitui por uma string pelos dados colocados no método
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // Insert the HTML into the DOM
            // DOM into html with income__container or expenses__container
                                                              //posição   //texto
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml); // insere no DOM o 'newHtml' dentro da propriedade 'element'
        },

        clearFields: function() {
            var fields, fieldsArr;

            // retorna uma lista	
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            // converte o fields para uma Arrey
            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });

            fieldsArr[0].focus();
        },

        displayBudget: function(obj) {

                document.querySelector(DOMstrings.budgetLabel).textContent      = obj.budget;
                document.querySelector(DOMstrings.incomeLabel).textContent      = obj.totalInc;
                document.querySelector(DOMstrings.expensesLabel).textContent    = obj.totalExp;

            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent  = '- ' + obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent  = '---';
            }
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
            if (event.keyCode === 13 || event.which === 13) { // 13 = Enter
                ctrlAddItem();
            }
        });   
        
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

    };    

    var updateBudget = function() {
        
        // 1. Calculate the budget
        budgetCtrl.calculateBudget();

        // 2. Return the Budget
        var budget = budgetCtrl.getBudget();

        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);
        //console.log(budget);

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

    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;

        // manipulação da selação do elemento requerido
        itemID = event.target.parentNode.parentNode.parentNode.id;
        // console.log(itemID);

        if (itemID) {

            // inc-1
            splitID = itemID.split('-');    // retorna um array dividindo os elementos a partir do '-'
            type    = splitID[0];           // inc or exp
            ID      = parseInt(splitID[1]);           // 0 or 1

            // 1. Delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);

            // 2. Delete the item from the UI 

            // 3. Update and show the new budget

        }
    };
    
    return {
        init: function() {
            console.log('Application has started.');
            setTimeout("document.querySelector('.welcome').style.visibility = 'hidden';", 3000);
            UICtrl.displayBudget({
                budget      : 0,
                totalInc    : 0,
                totalExp	: 0,
                percentage  : -1
            });
            setupEventListeners();
        }
    };
    
})(budgetController, UIController);

controller.init();