<h4>uberList <small>Deine geteilte ToDo Liste</small></h4>
	<ul class="nav nav-tabs" id="myTab" role="tablist">
		<li class="nav-item">
			<a class="nav-link active" id="login-tab" data-toggle="tab" href="#login" role="tab" aria-controls="login" aria-selected="true">Login</a>
		</li>
		<li class="nav-item">
			<a class="nav-link" id="register-tab" data-toggle="tab" href="#register" role="tab" aria-controls="register" aria-selected="false">Register</a>
		</li>
	</ul>
	<div class="tab-content" id="myTabContent">
		<div class="tab-pane fade show active" id="login" role="tabpanel" aria-labelledby="login-tab">
			<form id="form-login" action="mainView.php" method="post">
				<div class="form-group">
					<label>Username/Email</label>
					<input type="text" class="form-control" id="loginText" placeholder="Enter username / Email" name="loginUsername">
				</div>
				<div class="form-group">
					<label>Password</label>
					<input type="password" class="form-control" name="loginPassword">
				</div>
				<div class="form-check">
					<input type="checkbox" class="form-check-input" id="keepLogin">
					<label class="form-check-label">Stay logged in</label>
				</div>
				<button type="submit" class="btn btn-primary">Login</button>
			</form>
		</div>
		<div class="tab-pane fade" id="register" role="tabpanel" aria-labelledby="register-tab">
			<form id="form-register" method="post">
				<div class="form-group">
					<label for="exampleInputEmail1">Username</label>
					<input type="text" class="form-control" id="usernameInput" placeholder="Username" name="username">
				</div>
				<div class="form-group">
					<label for="exampleInputEmail1">Email address</label>
					<input type="email" class="form-control" id="exampleInputEmail1" placeholder="Enter email" name="email">
				</div>
				<div class="form-group">
					<label for="exampleInputPassword1">Password</label>
					<input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password" name="password">
				</div>
				<div class="form-group">
					<label for="exampleInputPassword1">Password Check</label>
					<input type="password" class="form-control" id="exampleInputPasswordCheck" placeholder="Password Check">
				</div>
				<button type="submit" class="btn btn-primary">Register</button>
			</form>
		</div>
	</div>
