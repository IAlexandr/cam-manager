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

var Itv = React.createClass({

    propTypes: {
        start: React.PropTypes.object,  // date
        serverIp: React.PropTypes.string.isRequired,
        camId: React.PropTypes.string.isRequired
    },

    getInitialState: function () {

        // Это выполняется перед функцией render. Возвращаемый объект
        // присваивается в this.state, чтобы мы могли использовать его позже.

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

        // Этот метод вызывается сразу после того,
        // как компонент удален
        // со страницы и уничтожен. Мы можем удалить интервал здесь:

        clearTimeout(this.toHandle);
        clearTimeout(this.tickHandle);
        clearTimeout(this.camToHandle);
        clearTimeout(this.checkConnectTimeoutHandle);

    },

    render: function () {

        // Хоть мы и возвращаем целый <p> элемент, react разумно обновит
        // только измененные части, содержащие переменную seconds.

        var mainContent;
        switch (this.state.mode) {
            case MODE_INITIAL:
            case MODE_CONNECT:
            case MODE_SHOW:
                mainContent = (
                    <object
                        ref = "camMon"
                        classID = { "clsid:" + ACTIVEX_ITV_CLASS_ID }
                    />
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
                <b>server ip: { this.props.serverIp }</b>
                <br />
                <b>cam id: { this.props.camId }</b>
                <br />
                <b>mode: { this.state.mode }</b>
                <br />
                <b>error msg: { this.state.errorMessage }</b>
                <br />
                <div>{ mainContent }</div>
            </div>
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
