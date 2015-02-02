var CamBundle = React.createClass({
    render: function () {
        return (
            <div>
                <p>
                    <Itv
                        serverIp="10.157.199.15"
                        camId="125"
                    />
                </p>
            </div>
        );
    }
});

React.renderComponent(
    <CamBundle />,
    document.body
);