package com.statesofmind

class OrderExpense {

    ExpenseCategory category
    Vendor paidTo
    String notes
    Double amt
   
    static constraints = {
        category blank: false
    }

    static belongsTo = [order: Order]
}
