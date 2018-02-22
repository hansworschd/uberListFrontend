<?php require("header.php"); ?>
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
		<form id="form-login">
			<div class="form-group">
				<label>Username/Email</label>
				<input type="text" class="form-control" id="loginText" placeholder="Enter username / Email">
			</div>
			<div class="form-group">
				<label>Password</label>
				<input type="password" class="form-control" placeholder="Password should be safe">
			</div>
			<div class="form-check">
				<input type="checkbox" class="form-check-input" id="keepLogin">
				<label class="form-check-label">Stay logged in</label>
			</div>
			<button type="submit" class="btn btn-primary">Login</button>
		</form>
	</div>
	<div class="tab-pane fade" id="register" role="tabpanel" aria-labelledby="register-tab">
		<form id="register-form">
			<div class="form-group">
				<label for="exampleInputEmail1">Email address</label>
				<input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email">
				<small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
			</div>
			<div class="form-group">
				<label for="exampleInputPassword1">Password</label>
				<input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
			</div>
			<div class="form-check">
				<input type="checkbox" class="form-check-input" id="exampleCheck1">
				<label class="form-check-label" for="exampleCheck1">Check me out</label>
			</div>
			<button type="submit" class="btn btn-primary">Register</button>
		</form>
	</div>
</div>
<?php require("footer.php"); ?>
