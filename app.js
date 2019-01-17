// BUDGET CONTROLLER
var budgetController = (function() {
    // FUNCTION CONSTRUCTOR das despesas
    var Expanse = function(id, description, value) {
        this.id             = id;
        this.description    = description;
        this.value          = value;
    };

    var Income = function(id, description, value) {
        this.id             = id;
        this.description	= description;
        this.value	        = value;
    };

    // DADOS UI
    var data = {
        // Objetvo que armazena os dados de cada item na tela da UI
        allItems: {
            exp: [],
            inc: [],
        },
        totals: {
            exp: 0,
            inc: 0,
        }
    }

})();

// UI CONTROLLER
var UIController = (function() {

    // Objeto que recebe valores do DOM
    var DOMStrings = {
        inputType:          '.add__type',
        inputDescription:   '.add__description',
        inputValue:         '.add__value',
        inputBtn:           '.add__btn',
    }

    return {
        //Função que retorna o valor dos inputs em um objeto
        getInput: function() {
            return {
            type:           document.querySelector(DOMStrings.inputType).value, // Will be either inc or exp
            description:    document.querySelector(DOMStrings.inputDescription).value,
            value:          document.querySelector(DOMStrings.inputValue).value,
            }   
        },

        // expõe o DOMStrings ao público
        getDOMStrings: function () {
            return DOMStrings;
        }
    };

})();

// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {

    var setupEventListeners = function() {
        // passa a ter acesso ao DOMStrings.
        var DOM = UIController.getDOMStrings();

        // BOTÃO ADD
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        // O evento keypress não acontece em elementos específicos, mas acontece na página da web global.
        // Starta o evento quando a tecla ENTER é acionada
        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    };

    // Adiciona Item
    var ctrlAddItem = function() {
        // 1. Get the field input data
        var input = UIController.getInput();
        
        // 2. Add the item to the budget controller

        // 3. Add the item to the UI

        // 4. Calculate the budget

        // 5. Display the budget on the UI
    }

    return {
        init: function() {
            setupEventListeners();
        }
    };
    
})(budgetController, UIController);

controller.init();

























