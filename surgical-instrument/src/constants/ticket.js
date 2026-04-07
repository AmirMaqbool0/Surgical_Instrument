const TICKET_SUPPORT_TYPES = {
    TECHNICAL_RELATED: "Technical Related",
    SOFTWARE_BUG: 'Software Bug',
    HARDWARE_MALFUNCTION: 'Hardware Malfunction',
    NETWORK_CONNECTIVITY_ISSE: 'Network Connectivity Issue',
    CONFIGURATION_ERROR: 'Configuration Error',
    PERFORMANCE_BOTTLENECK: 'Performance Bottleneck'
}
const TICKET_STATUS = {
    OPEN: "open",
    INPROGRESS: "inprogress",
    RESOLVED: "resolved",
    CLOSED: "closed"
}

module.exports = {
    TICKET_SUPPORT_TYPES,
    TICKET_STATUS
}