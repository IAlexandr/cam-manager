var CamBundle = React.createClass({
    render: function () {
        return (
            <div>
                <div>
                    <Itv
                        serverIp = "10.157.199.15"
                        camId = "125"
                        width = "320px"
                        height = "240px"
                    />
                </div>
                <div>
                    <Axis
                        userName = "user"
                        password = "user21"
                        camIp = "10.157.197.133"
                        width = "320px"
                        height = "240px"
                    />
                </div>
                <div>
                    <Mobotix
                        userName = "user"
                        password = "user21"
                        camIp = "10.157.197.62"
                        width = "320px"
                        height = "240px"
                    />
                </div>
            </div>
        );
    }
});

React.renderComponent(
    <CamBundle />,
    document.body
);