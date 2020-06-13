+++
title="Contact Us"
+++
<div class="mdl-grid">
            <h4>We're excited to hear from you! Fill out a form and our team will contact you shortly.</h4><br>
    <section class="mdl-cell mdl-cell--8-col mdl-cell--12-col-tablet mdl-cell--12-col-phone">
        <div id="contact" class="home-works">
            <form id="contact-form" action="/form.bluesquad.dev" method="post">
                <label for="subject" name="subject">I'm interested in...</label><br>
                <select for="subject" name="subject">
                    <option value="development">Hiring dev team?</option>
                    <option value="outsourcing">project outsourcing?</option>
                    <option value="other">Something else?</option>
                </select><br><br>
                <label for="fname">First Name:</label><br>
                <input type="text" name="fname" placeholder="John" required="required"><br><br>
                <label for="lname">Last Name:</label><br> 
                <input type="text" name="lname" placeholder="Doe" required="required"><br><br>
                <label for="email">E-Mail Address:</label><br>
                <input type="email" name="email" placeholder="john.doe@gmail.com" required="required"><br><br>
                <label for="description">Project Description:</label><br>
                <textarea type="input" name="description" required="required" rows="10" cols="30"></textarea><br><br>
                <input type="submit">
            </form>
        </div>
    </section>
    <aside class="mdl-cell mdl-cell--4-col mdl-cell--12-col-tablet mdl-cell--12-col-phone">
    </aside>
</div>