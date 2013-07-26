
<%@ page import="com.statesofmind.Order" %>
<!DOCTYPE html>
<html>
	<head>
		<meta name="layout" content="main">
		<g:set var="entityName" value="${message(code: 'order.label', default: 'Order')}" />
		<title><g:message code="default.list.label" args="[entityName]" /></title>
	</head>
	<body>
		<a href="#list-order" class="skip" tabindex="-1"><g:message code="default.link.skip.label" default="Skip to content&hellip;"/></a>
		<div class="nav" role="navigation">
			<ul>
				<li><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></li>
				<li><g:link class="create" action="create"><g:message code="default.new.label" args="[entityName]" /></g:link></li>
			</ul>
		</div>
		<div id="list-order" class="content scaffold-list" role="main">
			<h1><g:message code="default.list.label" args="[entityName]" /></h1>
			<g:if test="${flash.message}">
			<div class="message" role="status">${flash.message}</div>
			</g:if>
			<table>
				<thead>
					<tr>
					
						<g:sortableColumn property="plannedCompleteDate" title="${message(code: 'order.plannedCompleteDate.label', default: 'Planned Complete Date')}" />
					
						<g:sortableColumn property="actualCompleteDate" title="${message(code: 'order.actualCompleteDate.label', default: 'Actual Complete Date')}" />
					
						<g:sortableColumn property="amount" title="${message(code: 'order.amount.label', default: 'Amount')}" />
					
						<g:sortableColumn property="blanksOrdered" title="${message(code: 'order.blanksOrdered.label', default: 'Blanks Ordered')}" />
					
						<th><g:message code="order.client.label" default="Client" /></th>
					
						<g:sortableColumn property="desc" title="${message(code: 'order.desc.label', default: 'Desc')}" />
					
					</tr>
				</thead>
				<tbody>
				<g:each in="${orderInstanceList}" status="i" var="orderInstance">
					<tr class="${(i % 2) == 0 ? 'even' : 'odd'}">
					
						<td><g:link action="show" id="${orderInstance.id}">${fieldValue(bean: orderInstance, field: "plannedCompleteDate")}</g:link></td>
					
						<td><g:formatDate date="${orderInstance.actualCompleteDate}" /></td>
					
						<td>${fieldValue(bean: orderInstance, field: "amount")}</td>
					
						<td><g:formatBoolean boolean="${orderInstance.blanksOrdered}" /></td>
					
						<td>${fieldValue(bean: orderInstance, field: "client")}</td>
					
						<td>${fieldValue(bean: orderInstance, field: "desc")}</td>
					
					</tr>
				</g:each>
				</tbody>
			</table>
			<div class="pagination">
				<g:paginate total="${orderInstanceTotal}" />
			</div>
		</div>
	</body>
</html>
