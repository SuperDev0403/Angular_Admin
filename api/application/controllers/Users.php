<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Users extends BD_Controller {
    function __construct()
    {
        // Construct the parent class
        parent::__construct();
        $this->auth();
        $this->load->model('M_users');
        $this->load->model('M_client');
        $this->load->model('M_client_module');
    }
    
    public function getUsers_get()
	{
        $users = $this->M_users->getUsers();
        $clients = $this->M_client->get_clients();
        $client_types = $this->M_client->get_types();
        $output['users'] = $users;
        $output['clients'] = $clients;
        $output['client_types'] = $client_types;
        $this->set_response($output, REST_Controller::HTTP_OK);
    }

    public function addUser_post() {
        $input_data = array(
            "name" => $this->post('name'),
            "email" => $this->post('email'),
            "password" =>  sha1($this->post('password')),
            "client_id" => $this->post('client_id'),
            "role" => $this->post('role'),
            "is_active" => $this->post('is_active')
        );
        $output = $this->M_users->insert_user($input_data);
        if ($output)
        {
            $message = [
                'status' => true,
                'message' => "Registered successfully."
            ];
           $this->response($message, REST_Controller::HTTP_OK);
        } else
        {
            $message = [
                'status' => FALSE,
                'message' => "Something went wrong. Please try again later."
            ];
            $this->response($message, REST_Controller::HTTP_NOT_FOUND);
       }
    }

    public function editUser_post() {
        $id = $this->post('id');
        $input_data = array(
            "name" => $this->post('name'),
            "email" => $this->post('email'),
            "client_id" => $this->post('client_id'),
            "role" => $this->post('role'),
            "is_active" => $this->post('is_active')
        );
        if ($this->post('password'))
            $input_data['password'] = sha1($this->post('password'));

        $output = $this->M_users->edit_user($id, $input_data);
        if ($output)
        {
            $message = [
                'status' => true,
                'message' => "success"
            ];
           $this->response($message, REST_Controller::HTTP_OK);
        } else
        {
            $message = [
                'status' => FALSE,
                'message' => "Something went wrong. Please try again later."
            ];
            $this->response($message, REST_Controller::HTTP_NOT_FOUND);
       }
    }

    public function deleteUser_post() {
        $id = $this->post('id');
        $output = $this->M_users->delete_user($id);
        if ($output)
        {
            $message = [
                'status' => true,
                'message' => "success"
            ];
           $this->response($message, REST_Controller::HTTP_OK);
        } else
        {
            $message = [
                'status' => FALSE,
                'message' => "Something went wrong. Please try again later."
            ];
            $this->response($message, REST_Controller::HTTP_NOT_FOUND);
       }
    }

    public function addClient_post() {
        $input_data = array(
            "client_name" => $this->post('client_name'),
            "client_cif" => $this->post('client_cif'),
            "client_type_id" => $this->post('client_type_id'),
            "client_is_active" => $this->post('client_is_active')
        );
        $output = $this->M_client->insert_client($input_data);
        if ($output)
        {
            $message = [
                'status' => true,
                'message' => "Registered successfully."
            ];
           $this->response($message, REST_Controller::HTTP_OK);
        } else
        {
            $message = [
                'status' => FALSE,
                'message' => "Something went wrong. Please try again later."
            ];
            $this->response($message, REST_Controller::HTTP_NOT_FOUND);
       }
    }

    public function editClient_post() {
        $id = $this->post('client_id');
        $input_data = array(
            "client_name" => $this->post('client_name'),
            "client_cif" => $this->post('client_cif'),
            "client_type_id" => $this->post('client_type_id'),
            "client_is_active" => $this->post('client_is_active')
        );
        $output = $this->M_client->edit_client($id, $input_data);
        if ($output)
        {
            $message = [
                'status' => true,
                'message' => "success"
            ];
           $this->response($message, REST_Controller::HTTP_OK);
        } else
        {
            $message = [
                'status' => FALSE,
                'message' => "Something went wrong. Please try again later."
            ];
            $this->response($message, REST_Controller::HTTP_NOT_FOUND);
       }
    }

    public function deleteClient_post() {
        $id = $this->post('client_id');
        $output = $this->M_client->delete_client($id);
        if ($output)
        {
            $message = [
                'status' => true,
                'message' => "success"
            ];
           $this->response($message, REST_Controller::HTTP_OK);
        } else
        {
            $message = [
                'status' => FALSE,
                'message' => "Something went wrong. Please try again later."
            ];
            $this->response($message, REST_Controller::HTTP_NOT_FOUND);
       }
    }

    public function getClientmodules_get()
	{
        $clients = $this->M_client_module->get_client_names();
        $client_modules = $this->M_client_module->get_client_modules();
        $marketplaces = $this->M_client_module->get_marketplace_codes();
        $output['client_modules'] = $client_modules;
        $output['clients'] = $clients;
        $output['marketplaces'] = $marketplaces;
        $this->set_response($output, REST_Controller::HTTP_OK);
    }
    
    public function addClientmodule_post() {
        $input_data = array(
            "client_module_client_id" => $this->post('client_module_client_id'),
            "client_module_marketplace_id" => $this->post('client_module_marketplace_id'),
            "client_module_is_review" => $this->post('client_module_is_review'),
            "client_module_is_price" => $this->post('client_module_is_price'),
            "client_module_is_answers" => $this->post('client_module_is_answers'),
            "client_module_is_po" => $this->post('client_module_is_po'),
            "client_module_is_active" => $this->post('client_module_is_active')
        );
        $output = $this->M_client_module->insert_clientmodule($input_data);
        if ($output)
        {
            $message = [
                'status' => true,
                'message' => "Registered successfully."
            ];
           $this->response($message, REST_Controller::HTTP_OK);
        } else
        {
            $message = [
                'status' => FALSE,
                'message' => "Something went wrong. Please try again later."
            ];
            $this->response($message, REST_Controller::HTTP_NOT_FOUND);
       }
    }

    public function editClientmodule_post() {
        $id = $this->post('client_module_id');
        $input_data = array(
            "client_module_client_id" => $this->post('client_module_client_id'),
            "client_module_marketplace_id" => $this->post('client_module_marketplace_id'),
            "client_module_is_review" => $this->post('client_module_is_review'),
            "client_module_is_price" => $this->post('client_module_is_price'),
            "client_module_is_answers" => $this->post('client_module_is_answers'),
            "client_module_is_po" => $this->post('client_module_is_po'),
            "client_module_is_active" => $this->post('client_module_is_active')
        );
        $output = $this->M_client_module->edit_clientmodule($id, $input_data);
        if ($output)
        {
            $message = [
                'status' => true,
                'message' => "success"
            ];
           $this->response($message, REST_Controller::HTTP_OK);
        } else
        {
            $message = [
                'status' => FALSE,
                'message' => "Something went wrong. Please try again later."
            ];
            $this->response($message, REST_Controller::HTTP_NOT_FOUND);
       }
    }

    public function deleteClientmodule_post() {
        $id = $this->post('client_module_id');
        $output = $this->M_client_module->delete_clientmodule($id);
        if ($output)
        {
            $message = [
                'status' => true,
                'message' => "success"
            ];
           $this->response($message, REST_Controller::HTTP_OK);
        } else
        {
            $message = [
                'status' => FALSE,
                'message' => "Something went wrong. Please try again later."
            ];
            $this->response($message, REST_Controller::HTTP_NOT_FOUND);
       }
    }
}
