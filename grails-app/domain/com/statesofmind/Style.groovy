package com.statesofmind

class Style {

    String name
    List<String> tags

    static hasMany = [ sources : Source ]

    static constraints = {
        name()
    }

}
