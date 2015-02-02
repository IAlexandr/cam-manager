var ACTIVEX_MOBOTIX_CLASS_ID = "304171C0-65EA-4B51-B5D9-93A311E26EB1";

var MODE_INITIAL = 'initial';
var MODE_ERROR = 'error';
var MODE_SHOW = 'show';

var DEFAULT_MOBOTIX_WIDTH = "320px";
var DEFAULT_MOBOTIX_HEIGHT = "240px";

var Mobotix = React.createClass({
    propTypes: {
        userName: React.PropTypes.string.isRequired,
        password: React.PropTypes.string.isRequired,
        camIp: React.PropTypes.string.isRequired,
        width: React.PropTypes.string,
        height: React.PropTypes.string
    },

    getInitialState: function () {

        return {
            mode: MODE_INITIAL,
            errorMessage: ''
        };
    },

    componentDidMount: function () {
        var mbxNode = this.refs.mobotix.getDOMNode();

        var check = true;
        var errMessage = "";

        if ("object" in mbxNode) {
            try {
                debugger;
                mbxNode.navPlay();
            } catch (e) {
                check = false;
                errMessage = e.message;
            }
        } else {
            check = false;
            errMessage = "No object";
        }

        if (check) {
            this.setState({
                mode: MODE_SHOW
            });
        } else {
            this.setState({
                mode: MODE_ERROR,
                errorMessage: errMessage
            });
        }
    },

    componentWillUnmount: function () {
        //todo проверить надо ли останавливать mbxNode.Stop() ?
    },

    render: function () {

        var width = "";
        var height = "";
        if (this.props.width) {
            width = this.props.width;
        } else {
            width = DEFAULT_MOBOTIX_WIDTH;
        }

        if (this.props.height) {
            height = this.props.height;
        } else {
            height = DEFAULT_MOBOTIX_HEIGHT;
        }

        switch (this.state.mode) {
            case MODE_INITIAL:
                mainConent = (
                    <div>
                        <b>cam ip: { this.props.camIp }</b>
                        <br />
                        <b>mode: { this.state.mode }</b>
                        <br />
                    </div>
                );
            case MODE_CONNECT:
            case MODE_SHOW:
                mainContent = (
                    <object
                        width = { width }
                        height = { height }
                        ref = "mobotix"
                        classID = { "clsid:" + ACTIVEX_MOBOTIX_CLASS_ID }
                    >
                        <param
                            name="IP"
                            value={ this.props.camIp }
                        />
                        <param
                            name="Username"
                            value={ this.props.userName }
                        />
                        <param
                            name="Password"
                            value={ this.props.password }
                        />
                        <param
                            name="Port"
                            value="80"
                        />
                        <param
                            name="SSL"
                            value="0"
                        />
                        <param
                            name="Audio"
                            value="0"
                        />
                        <param
                            name="AudioToCam"
                            value="0"
                        />
                        <param
                            name="AudioFullduplex"
                            value="0"
                        />
                        <param
                            name="Framerate"
                            value="25"
                        />
                        <param
                            name="EnablePopupmenu"
                            value="1"
                        />
                        <param
                            name="EnableClickInterface"
                            value="0"
                        />
                        <param
                            name="DisplayStrategy"
                            value="minimum delay"
                        />
                        <param
                            name="Proxy"
                            value=""
                        />
                        <param
                            name="ProxyPort"
                            value=""
                        />
                        <param
                            name="ScaleImage"
                            value="Auto"
                        />
                        <param
                            name="AccessLevel"
                            value="User"
                        />
                        <param
                            name="BackColor"
                            value="0x00ff0000"
                        />
                        <param
                            name="Player"
                            value="0"
                        />
                        <param
                            name="Live"
                            value="1"
                        />
                        <param
                            name="UnLockCode"
                            value=""
                        />
                        <param
                            name="FireEventOnFinishedFrame"
                            value="0"
                        />
                        <param
                            name="maxdelay"
                            value="15"
                        />
                        <param
                            name="GoodRender"
                            value="1"
                        />
                    </object>
                );
                break;
            case MODE_ERROR:
                mainContent = (
                    <div>
                        <p>
                            <b>Ошибка</b>
                        </p>
                        <p>{ this.state.errorMessage }</p>
                    </div>
                );
                break;
            default:
                throw new Error("Unknown mode.");
        }

        return (
            <div>
                <b>cam ip: { this.props.camIp }</b>
                <br />
                <b>mode: { this.state.mode }</b>
                <br />
                <div>{ mainContent }</div>
            </div>
        )
    }
});
