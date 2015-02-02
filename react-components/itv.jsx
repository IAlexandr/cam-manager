var ACTIVEX_ITV_CLASS_ID = "3A41B075-E368-4F94-9E59-5F26DC102BF4";

var CONNECT_TIMEOUT = 30 * 1000;
var CONNECT_TICK_INTERVAL = 5 * 1000;

var CHECKCONNECT_INTERVAL = 200;

var CAMERA_SHOW_TIMES = 5;
var CAMERA_SHOW_INTERVAL = 3 * 1000;

var MODE_INITIAL = 'initial';
var MODE_CONNECT = 'connect';
var MODE_ERROR = 'error';
var MODE_SHOW = 'show';

// https://doc.axxonsoft.com/confluence/pages/viewpage.action?pageId=119015369#id-ПараметрыCamMonitor.ocx-CamButtonsOptions
var ITV_CAM_BUTTON_OPTIONS = parseInt('1100000111', 2);

var Itv = React.createClass({

    propTypes: {
        start: React.PropTypes.object,  // date
        serverIp: React.PropTypes.string.isRequired,
        camId: React.PropTypes.string.isRequired,
        width: React.PropTypes.number.isRequired,
        height: React.PropTypes.number.isRequired
    },

    getInitialState: function () {

        return {
            mode: MODE_INITIAL,
            errorMessage: ''
        };
    },

    componentDidMount: function () {
        var cmNode = this.refs.camMon.getDOMNode();
        var check = true;
        var errMessage = "";

        if ("object" in cmNode) {
            try {
                cmNode.object.isConnected();
            } catch (e) {
                check = false;
                errMessage = e.message;
            }
        } else {
            check = false;
            errMessage = "No object";
        }

        if (check) {
            this.startConnect();
        } else {
            this.setState({
                mode: MODE_ERROR,
                errorMessage: errMessage
            });
        }
    },

    componentWillUnmount: function () {

        clearTimeout(this.toHandle);
        clearTimeout(this.tickHandle);
        clearTimeout(this.camToHandle);
        clearTimeout(this.checkConnectTimeoutHandle);

    },

    render: function () {

        var mainContent;
        switch (this.state.mode) {
            case MODE_INITIAL:
            case MODE_CONNECT:
            case MODE_SHOW:
                mainContent = (
                    <object
                        width = { this.props.width }
                        height = { this.props.height }
                        ref = "camMon"
                        classID = { "clsid:" + ACTIVEX_ITV_CLASS_ID }
                    />
                );
                break;
            case MODE_ERROR:
                mainContent = (
                    <div
                        style = {{
                            width: this.props.width,
                            height: this.props.height
                        }}
                    >
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
            <div>{ mainContent }</div>
        );
    },

    startConnect: function () {
        var _this = this;
        this.toHandle = setTimeout(function () {
            clearTimeout(_this.tickHandle);
            clearTimeout(_this.checkConnectTimeoutHandle);
            _this.setState({
                mode: MODE_ERROR,
                errorMessage: 'Connection timeout'
            });
        }, CONNECT_TIMEOUT);

        this.tryConnect();
        this.checkConnect();
    },

    tryConnect: function () {
        var cmNode = this.refs.camMon.getDOMNode();
        cmNode.object.CamButtonsOptions = ITV_CAM_BUTTON_OPTIONS;
        cmNode.object.Connect(this.props.serverIp, "", "", "", 0);
        this.tickHandle = setTimeout(this.tryConnect, CONNECT_TICK_INTERVAL);
    },

    checkConnect: function () {
        var cmNode = this.refs.camMon.getDOMNode();
        if (cmNode.object.isConnected() === 1) {
            clearTimeout(this.toHandle);
            clearTimeout(this.tickHandle);
            this.setState({
                mode: MODE_CONNECT
            });
            this.startShowCamera();
        } else {
            this.checkConnectTimeoutHandle = setTimeout(this.checkConnect, CHECKCONNECT_INTERVAL);
        }
    },

    startShowCamera: function () {
        this.cameraShowCounter = CAMERA_SHOW_TIMES;
        this.tryShowCamera();
        this.setState({
            mode: MODE_SHOW
        });
    },

    tryShowCamera: function () {
        var cmNode = this.refs.camMon.getDOMNode();
        cmNode.object.ShowCam(this.props.camId, 0, 1);
        if (--this.cameraShowCounter > 0) {
            this.camToHandle = setTimeout(this.tryShowCamera, CAMERA_SHOW_INTERVAL);
        }
    }

});
