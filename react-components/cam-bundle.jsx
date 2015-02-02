var DEFAULT_WIDTH = 320;
var DEFAULT_HEIGHT = 240;

var CamBundle = React.createClass({

    propTypes: {
        type: React.PropTypes.string.isRequired,
        connectionOptions: React.PropTypes.object.isRequired,
        width: React.PropTypes.number,
        height: React.PropTypes.number
    },

    render: function () {

        var width = "";
        var height = "";
        if (this.props.width) {
            width = this.props.width;
        } else {
            width = DEFAULT_WIDTH;
        }

        if (this.props.height) {
            height = this.props.height;
        } else {
            height = DEFAULT_HEIGHT;
        }

        var conOp = this.props.connectionOptions;
        var mainContent;
        switch (this.props.type) {
            case "ITV":
                mainContent = (
                    <Itv
                        serverIp = { conOp.serverIp }
                        camId = { conOp.camId }
                        width = { width }
                        height = { height }
                    />
                );
                break;
            case "AXIS":
                mainContent = (
                    <Axis
                        userName = { conOp.userName }
                        password = { conOp.password }
                        camIp = { conOp.camIp }
                        width = { width }
                        height = { height }
                    />
                );
                break;
            case "MOBOTIX":
                mainContent = (
                    <Mobotix
                        userName = { conOp.userName }
                        password = { conOp.password }
                        camIp = { conOp.camIp }
                        width = { width }
                        height = { height }
                    />
                );
                break;
            case "ETROVISION":
                break;
            default:
                break;
        }

        return (
            <div> {mainContent} </div>
        );
    }
});

React.renderComponent(
    <div>
        <CamBundle
            type="ITV"
            width = { 420 }
            height = { 240 }
            connectionOptions = {{
                serverIp: "10.157.199.15",
                camId: "125"
            }}
        />
        <CamBundle
            type="AXIS"
            connectionOptions = {{
                userName: "user",
                password: "user21",
                camIp: "10.157.197.133"
            }}
        />
        <CamBundle
            type="MOBOTIX"
            width = { 320 }
            height = { 240 }
            connectionOptions = {{
                userName: "user",
                password: "user21",
                camIp: "10.157.197.62"
            }}
        />
    </div>
    ,
    document.body
);
