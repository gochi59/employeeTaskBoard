import styled from "styled-components";

const StyledText = styled.p`
  font-family: "Monsterrat", sans-serif;
`;

const LoginPage = () => {
  return (
    <div className="row vh-100">
      <div className="col-md-6 bg-dark text-bg-dark h-100 justify-content-center align-content-center h-auto">
        <StyledText>
          <p className="h1 text-center">
            Beesheet
            <br />
            Login and Signup
          </p>
        </StyledText>
      </div>
      <div className="col-md-6 bg-dark-subtle align-content-center col-12">
        <form className="p-3" method="post">
            <label htmlFor="email" className="form-label text-body-emphasis h6">Email:</label>
            <input type="email" name="email" id="email" className="form-control mb-2"/>
            <label htmlFor="passoword" className="form-label text-body-emphasis h6">Password:</label>
            <input type="password" name="password" id="password" className="form-control mb-3"/>
            <button type="submit" className="btn btn-dark me-2">Submit</button>
            <button className="btn btn-dark">Signup</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
