export default function HomePage() {

    return (
        <div className="container mt-3">
            <div className="row">
                <div className="col-6">
                    <h2 className="text-center">Rooms</h2>
                    <table className="table table-striped table-hover table-sm">
                        <thead>
                            <tr>
                                <th scope="col">Id</th>
                                <th scope="col">Name</th>
                                <th scope="col">Creator</th>
                                <th scope="col">Topic</th>
                                <th scope="col">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row">asdsadsadsad</th>
                                <td>MyRoom</td>
                                <td>User1</td>
                                <td>General Knowledge</td>
                                <td>Locked</td>
                            </tr>
                            <tr>
                                <th scope="row">dfssdfsdc</th>
                                <td>MyRoom2</td>
                                <td>User2</td>
                                <td>Rock Music</td>
                                <td>Open</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="col-6 align-self-center text-center">
                    <button className="btn btn-success" type="button">Create New Room</button>
                </div>
            </div>
        </div>
    )
}