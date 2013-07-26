
<%@ page import="com.statesofmind.Order" %>
<!DOCTYPE html>
<html>
	<head>
		<meta name="layout" content="main">
		<g:set var="entityName" value="${message(code: 'order.label', default: 'Order')}" />
		<title><g:message code="default.show.label" args="[entityName]" /></title>
	</head>
	<body>
		<a href="#show-order" class="skip" tabindex="-1"><g:message code="default.link.skip.label" default="Skip to content&hellip;"/></a>
		<div class="nav" role="navigation">
			<ul>
				<li><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></li>
				<li><g:link class="list" action="list"><g:message code="default.list.label" args="[entityName]" /></g:link></li>
				<li><g:link class="create" action="create"><g:message code="default.new.label" args="[entityName]" /></g:link></li>
			</ul>
		</div>
		<div id="show-order" class="content scaffold-show" role="main">
			<h1><g:message code="default.show.label" args="[entityName]" /></h1>
			<g:if test="${flash.message}">
			<div class="message" role="status">${flash.message}</div>
			</g:if>
			<ol class="property-list order">
			
				<g:if test="${orderInstance?.plannedCompleteDate}">
				<li class="fieldcontain">
					<span id="plannedCompleteDate-label" class="property-label"><g:message code="order.plannedCompleteDate.label" default="Planned Complete Date" /></span>
					
						<span class="property-value" aria-labelledby="plannedCompleteDate-label"><g:formatDate date="${orderInstance?.plannedCompleteDate}" /></span>
					
				</li>
				</g:if>
			
				<g:if test="${orderInstance?.actualCompleteDate}">
				<li class="fieldcontain">
					<span id="actualCompleteDate-label" class="property-label"><g:message code="order.actualCompleteDate.label" default="Actual Complete Date" /></span>
					
						<span class="property-value" aria-labelledby="actualCompleteDate-label"><g:formatDate date="${orderInstance?.actualCompleteDate}" /></span>
					
				</li>
				</g:if>
			
				<g:if test="${orderInstance?.amount}">
				<li class="fieldcontain">
					<span id="amount-label" class="property-label"><g:message code="order.amount.label" default="Amount" /></span>
					
						<span class="property-value" aria-labelledby="amount-label"><g:fieldValue bean="${orderInstance}" field="amount"/></span>
					
				</li>
				</g:if>
			
				<g:if test="${orderInstance?.blanksOrdered}">
				<li class="fieldcontain">
					<span id="blanksOrdered-label" class="property-label"><g:message code="order.blanksOrdered.label" default="Blanks Ordered" /></span>
					
						<span class="property-value" aria-labelledby="blanksOrdered-label"><g:formatBoolean boolean="${orderInstance?.blanksOrdered}" /></span>
					
				</li>
				</g:if>
			
				<g:if test="${orderInstance?.client}">
				<li class="fieldcontain">
					<span id="client-label" class="property-label"><g:message code="order.client.label" default="Client" /></span>
					
						<span class="property-value" aria-labelledby="client-label"><g:link controller="client" action="show" id="${orderInstance?.client?.id}">${orderInstance?.client?.encodeAsHTML()}</g:link></span>
					
				</li>
				</g:if>
			
				<g:if test="${orderInstance?.desc}">
				<li class="fieldcontain">
					<span id="desc-label" class="property-label"><g:message code="order.desc.label" default="Desc" /></span>
					
						<span class="property-value" aria-labelledby="desc-label"><g:fieldValue bean="${orderInstance}" field="desc"/></span>
					
				</li>
				</g:if>
			
				<g:if test="${orderInstance?.expenses}">
				<li class="fieldcontain">
					<span id="expenses-label" class="property-label"><g:message code="order.expenses.label" default="Expenses" /></span>
					
						<g:each in="${orderInstance.expenses}" var="e">
						<span class="property-value" aria-labelledby="expenses-label"><g:link controller="orderExpense" action="show" id="${e.id}">${e?.encodeAsHTML()}</g:link></span>
						</g:each>
					
				</li>
				</g:if>
			
				<g:if test="${orderInstance?.notes}">
				<li class="fieldcontain">
					<span id="notes-label" class="property-label"><g:message code="order.notes.label" default="Notes" /></span>
					
						<span class="property-value" aria-labelledby="notes-label"><g:fieldValue bean="${orderInstance}" field="notes"/></span>
					
				</li>
				</g:if>
			
				<g:if test="${orderInstance?.numOfDesigns}">
				<li class="fieldcontain">
					<span id="numOfDesigns-label" class="property-label"><g:message code="order.numOfDesigns.label" default="Num Of Designs" /></span>
					
						<span class="property-value" aria-labelledby="numOfDesigns-label"><g:fieldValue bean="${orderInstance}" field="numOfDesigns"/></span>
					
				</li>
				</g:if>
			
				<g:if test="${orderInstance?.orderDate}">
				<li class="fieldcontain">
					<span id="orderDate-label" class="property-label"><g:message code="order.orderDate.label" default="Order Date" /></span>
					
						<span class="property-value" aria-labelledby="orderDate-label"><g:formatDate date="${orderInstance?.orderDate}" /></span>
					
				</li>
				</g:if>
			
				<g:if test="${orderInstance?.payments}">
				<li class="fieldcontain">
					<span id="payments-label" class="property-label"><g:message code="order.payments.label" default="Payments" /></span>
					
						<g:each in="${orderInstance.payments}" var="p">
						<span class="property-value" aria-labelledby="payments-label"><g:link controller="orderPayment" action="show" id="${p.id}">${p?.encodeAsHTML()}</g:link></span>
						</g:each>
					
				</li>
				</g:if>
			
				<g:if test="${orderInstance?.sentToPrinter}">
				<li class="fieldcontain">
					<span id="sentToPrinter-label" class="property-label"><g:message code="order.sentToPrinter.label" default="Sent To Printer" /></span>
					
						<span class="property-value" aria-labelledby="sentToPrinter-label"><g:formatBoolean boolean="${orderInstance?.sentToPrinter}" /></span>
					
				</li>
				</g:if>
			
			</ol>
			<g:form>
				<fieldset class="buttons">
					<g:hiddenField name="id" value="${orderInstance?.id}" />
					<g:link class="edit" action="edit" id="${orderInstance?.id}"><g:message code="default.button.edit.label" default="Edit" /></g:link>
					<g:actionSubmit class="delete" action="delete" value="${message(code: 'default.button.delete.label', default: 'Delete')}" onclick="return confirm('${message(code: 'default.button.delete.confirm.message', default: 'Are you sure?')}');" />
				</fieldset>
			</g:form>
		</div>
	</body>
</html>
