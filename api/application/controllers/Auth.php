<?php

defined('BASEPATH') OR exit('No direct script access allowed');
use \Firebase\JWT\JWT;

class Auth extends BD_Controller {

    function __construct()
    {
        // Construct the parent class
        parent::__construct();
        // Configure limits on our controller methods
        // Ensure you have created the 'limits' table and enabled 'limits' within application/config/rest.php
        $this->methods['users_get']['limit'] = 500; // 500 requests per hour per user/key
        $this->methods['users_post']['limit'] = 100; // 100 requests per hour per user/key
        $this->methods['users_delete']['limit'] = 50; // 50 requests per hour per user/key
        $this->load->model('M_users');
    }

    public function login_post()
    {
        $email = $this->post('email');
        $password = sha1($this->post('password'));
        $kunci = $this->config->item('thekey');
        $invalidLogin = ['status' => 'Invalid'];
        $user = $this->M_users->get_user($email);
        if(!$user)
        {
            $this->response($invalidLogin, REST_Controller::HTTP_NOT_FOUND);
        }
        
        $val = $user[0];
		$match = $val->password;
        if($password == $match){
        	$token['id'] = $val->id;
            $token['email'] = $email;
            $token['name'] = $val->name;
            $date = new DateTime();
            $token['iat'] = $date->getTimestamp();
            $token['exp'] = $date->getTimestamp() + 3600000*24*30;
            $output['token'] = JWT::encode($token,$kunci );
            $output['name'] = $val->name;
            $output['id'] = $val->id;
            $output['email'] = $val->email;
            $output['mc'] = $val->mc;
            $output['role'] = $val->role;
            $output['client_id'] = $val->client_id;
            $this->set_response($output, REST_Controller::HTTP_OK);
        }
        else {
            $this->set_response($invalidLogin, REST_Controller::HTTP_UNAUTHORIZED);
        }
    }

    public function register_post() {
        if (!$this->post('email') || !$this->post('name') || !$this->post('password'))
        {
            $message = array(
                'status' => false,
                'error' => 'invalid input fields',
                'message' => "Please Fill all fields"
            );
            $this->response($message, REST_Controller::HTTP_NOT_FOUND);
        }
        else
        {
            $email_exist = $this->M_users->check_email_exists($this->post('email'));
            if (!$email_exist) {
                $insert_data = array(
                    'name' => $this->post('name'),
                    'email' => $this->post('email'),
                    'password' => sha1($this->post('password')),
                    'mc' => $this->post('mc'),
                    'role' => ($this->post('role') !== NULL) ? $this->post('role') : 'admin'
                );

                $output = $this->M_users->insert_user($insert_data);
                if ($output)
                {
                    $message = [
                        'status' => true,
                        'message' => "User registration successful."
                    ];
                    $this->response($message, REST_Controller::HTTP_OK);
                } else
                {
                    $message = [
                        'status' => FALSE,
                        'message' => "Something went to wrong. Please try again later."
                    ];
                    $this->response($message, REST_Controller::HTTP_NOT_FOUND);
                }
            } else {
                $message = [
                    'status' => FALSE,
                    'message' => "Your Mail already Registered"
                ];
                $this->response($message, REST_Controller::HTTP_UNAUTHORIZED);
            }
        }
    }

    public function updatePassword_post() {
        $old_password = $this->post('old_password');
        $new_password = $this->post('new_password');
        $email = $this->post('email');
        $users = $this->M_users->get_user($email);
        if (!$users){
            $message = [
                'status' => false,
                'message' => 'Something went wrong.'
            ];
            $this->response($message, REST_Controller::HTTP_OK);
        }
        $user = $users[0];
        if($user->password != sha1($old_password)) {
            $message = [
                'status' => false,
                'message' => 'Old password is incorrect.'
            ];
            $this->response($message, REST_Controller::HTTP_OK);
        } else {
            $this->M_users->edit_user($user->id, array("password" => sha1($new_password)));
            $message = [
                'status' => true
            ];
            $this->response($message, REST_Controller::HTTP_OK);
        }
    }

}
